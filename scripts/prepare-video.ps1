# Turns a raw recording (OBS, rpicam-vid, an OpenCV VideoWriter...) into a web demo video:
# public/videos/<Name>.mp4 (H.264, at most 720p, starts playing before it has fully
# downloaded) and public/videos/<Name>.jpg (poster frame shown before playback).
# Audio is dropped unless -KeepAudio is given (for narration).
#
#   .\scripts\prepare-video.ps1 -In D:\recordings\sorter-run.mkv -Name lego-sorter-demo
#   .\scripts\prepare-video.ps1 -In run.mp4 -Name vision-demo -Start 5 -Duration 40 -PosterAt 12
#
# Then add to the project's front matter:
#   videos:
#     - src: /videos/<Name>.mp4
#       poster: /videos/<Name>.jpg
#       caption: What the viewer sees, in one sentence.
param(
  [Parameter(Mandatory)] [string]$In,
  [Parameter(Mandatory)] [ValidatePattern('^[\w-]+$')] [string]$Name,
  [double]$Start = 0,      # seconds to skip at the beginning
  [double]$Duration = 0,   # seconds to keep (0 = until the end)
  [double]$PosterAt = 2,   # second of the finished video used as poster
  [switch]$KeepAudio
)
$ErrorActionPreference = "Stop"
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw "ffmpeg not found. Install it (e.g. 'winget install Gyan.FFmpeg') and open a new terminal."
}

$dir = Join-Path $PSScriptRoot "..\public\videos"
New-Item -ItemType Directory -Force $dir | Out-Null
$mp4 = Join-Path $dir "$Name.mp4"
$jpg = Join-Path $dir "$Name.jpg"

$trim = @("-ss", $Start)
if ($Duration -gt 0) { $trim += @("-t", $Duration) }
$audio = if ($KeepAudio) { @("-c:a", "aac", "-b:a", "96k", "-ac", "2") } else { @("-an") }
ffmpeg -hide_banner -loglevel error -y @trim -i $In @audio `
  -vf "scale=-2:'min(720,ih)',fps=30" `
  -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart $mp4
if ($LASTEXITCODE) { throw "ffmpeg failed to encode $In" }

ffmpeg -hide_banner -loglevel error -y -ss $PosterAt -i $mp4 -frames:v 1 -q:v 3 $jpg
if ($LASTEXITCODE) { throw "ffmpeg failed to write the poster" }

$mb = [math]::Round((Get-Item $mp4).Length / 1MB, 1)
Write-Host "$mp4 ($mb MB)"
Write-Host "$jpg"
if ($mb -gt 25) { Write-Warning "Over 25 MB: shorten it with -Duration or raise -crf in this script." }
