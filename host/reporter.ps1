$driveinfo = [System.IO.DriveInfo]::GetDrives() | Where-Object { 
    $_.DriveType -eq "Fixed" -and $_.IsReady -eq $true 
} | Select-Object Name, AvailableFreeSpace, TotalSize
$boottime = [System.DateTimeOffset]::new((Get-CimInstance win32_operatingsystem | Select-Object LastBootUpTime).LastBootUpTime).ToUnixTimeMilliseconds()
$userinfo = whoami.exe
$netinfo = Get-NetAdapterStatistics | Select-Object ReceivedBytes, SentBytes
$ipinfo = Get-NetIPAddress | Select-Object IPAddress, InterfaceIndex, InterfaceAlias, AddressFamily
$time = [System.DateTimeOffset]::new((Get-Date)).ToUnixTimeMilliseconds()
# other needed things

$json = [System.Convert]::ToBase64String(
    [System.Text.Encoding]::UTF8.GetBytes(
        (@{
            driveinfo = $driveinfo;
            boottime  = $boottime;
            userinfo  = $userinfo;
            netinfo   = $netinfo;
            ipinfo    = $ipinfo;
            time      = $time;
        } | ConvertTo-Json)
    )
)

try {   
    $result = (Invoke-WebRequest -Uri 'http://10.0.2.2:8000/report' -Method Post -Headers @{'Content-Type' = 'text/plain' } -Body $json).Content | ConvertFrom-Json
    if ($result.status -ne "success") { throw }
}
catch {
    # save in a file to recover later
    $localSavePath = [System.IO.Path]::Combine($env:LOCALAPPDATA, "reporter")
    $localFile = [System.IO.Path]::Combine($localSavePath, $time)

    New-Item -ItemType Directory -Path $localSavePath -Force
    $json | Out-File $localFile
}
