# saatbilgisi

Sunucu `8000` portunda çalışıyor. VS Code **Ports** panelinde `8000` portunu bulun ve **Open in Browser** seçin. `127.0.0.1:8000` adresini Codespace dışındaki tarayıcıya doğrudan yazmayın; VS Code'un yönlendirdiği bağlantıyı kullanın.

Sunucuyu yeniden başlatman gerekirse proje klasöründe:

```
python3 -m http.server 8000 --bind 0.0.0.0
```