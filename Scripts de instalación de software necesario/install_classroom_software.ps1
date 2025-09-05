# Instalador automatizado de software para el aula
# Ejecutar este script como ADMINISTRADOR

$ErrorActionPreference = "Stop"


Function Install-WithWinget {
    param (
        [string]$PackageId,
        [string]$DisplayName
    )
    Write-Output "Instalando $DisplayName..."
    winget install --id $PackageId -e --silent
    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 1) {
        Write-Output "$DisplayName instalado o ya actualizado.`n"
    } else {
        Write-Output "Error al instalar $DisplayName (código $LASTEXITCODE).`n"
    }
}

Function Install-FromUrl {
    param (
        [string]$Url,
        [string]$InstallerPath
    )
    Write-Output "🟦 Descargando instalador desde $Url..."
    Invoke-WebRequest -Uri $Url -OutFile $InstallerPath
    Write-Output "🟦 Ejecutando instalador..."
    Start-Process $InstallerPath -Wait
    Write-Output "✅ Instalación desde $Url finalizada.`n"
}

# 1. Python 3.12
Install-WithWinget -PackageId "Python.Python.3.12" -DisplayName "Python 3.12"

# 2. Git for Windows
Install-WithWinget -PackageId "Git.Git" -DisplayName "Git"

# 3. NodeJS (con npm y npx)
Install-WithWinget -PackageId "OpenJS.NodeJS" -DisplayName "NodeJS"
# Write-Output "🔎 Verificando npm y npx..."
npm -v
npx -v

#irm https://astral.sh/uv/install.ps1 | iex
# 4. uv y uvx (requiere Python instalado previamente)
#Write-Output "🟦 Instalando uv y uvx con pip..."
# python -m pip install --upgrade pip
# python -m pip install uv uvx
# Write-Output "🔎 Verificando versiones..."
# uv --version
# uvx --version
# 5. Cursor (instalador manual desde web oficial)
#$cursorInstaller = "$env:TEMP\cursor-installer.exe"
#Install-FromUrl -Url "https://download.cursor.so/windows" -InstallerPath $cursorInstaller
Install-WithWinget -PackageId "astral-sh.uv" -DisplayName "uv"

# create .venv with python 3.11 wit uv
$venvPath = "$env:USERPROFILE\Desktop\python-venv"
$venvName = "python-venv"
$venvFullPath = Join-Path -Path $venvPath -ChildPath $venvName

Write-Output "`n🎉 Instalación completada."
Write-Host "`nPresiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
