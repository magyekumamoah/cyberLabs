function handlePSTerminalInput(event) {
    if (event.key === 'Enter') {
      const input = event.target;
      const command = input.value.trim();
      const output = document.getElementById('ps-output');
      let result = '';
  
      switch (true) {
        case command === 'Get-Help':
          result = 'Supported commands: Get-Help, Get-Date, Get-Location, Clear-Host, Write-Output, Get-Process, New-Item, Remove-Item';
          break;
        case command === 'Get-Date':
          result = new Date().toString();
          break;
        case command === 'Get-Location':
          result = 'C:\\Users\\Student';
          break;
        case command === 'Clear-Host':
          output.innerText = '';
          input.value = '';
          return;
        case command.startsWith('Write-Output '):
          result = command.slice(13);
          break;
        case command === 'Get-Process':
          result = 'Name       Id\n----       --\nexplorer   1234\npowershell 5678\ncode       9012';
          break;
        case command.startsWith('New-Item '):
          result = 'Item created (simulated).';
          break;
        case command.startsWith('Remove-Item '):
          result = 'Item removed (simulated).';
          break;
        default:
          result = `Command not recognized: ${command}`;
      }
  
      output.innerText += `\nPS> ${command}\n${result}`;
      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  }
  