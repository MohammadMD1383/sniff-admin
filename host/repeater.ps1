$searchPath = [System.IO.Path]::Combine($env:LOCALAPPDATA, "reporter")
$items = Get-ChildItem $searchPath

foreach ($item in $items) {
    try {
        $json = Get-Content $item
        $result = (Invoke-WebRequest -Uri 'http://10.0.2.2:8000/report' -Method Post -Headers @{'Content-Type' = 'text/plain' } -Body $json).Content | ConvertFrom-Json
        if ($result.status -ne "success") { throw }

        Remove-Item -Path $item
    }
    catch {}
}