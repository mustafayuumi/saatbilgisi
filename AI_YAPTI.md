# Yapılan Değişiklikler

1. **Ayrı HTML Sayfalarına Bölme (Multi-Page):**
   - Site tek sayfa yapısından çıkarılarak bağımsız HTML dosyalarına ayrıldı:
     - `index.html`: Giriş, sol bölgenin sınırlarına tam oturan kasa çerçevesi içinde çalışan mekanik kalibre, dönen kurma kolu ve rehber özet kartları.
     - `mekanizmalar.html`: Seiko NH, ETA, Ronda ve Miyota kalibreleri, arama, 4 kademeli filtreleme ve detay pencereleri (popover).
     - `komplikasyonlar.html`: Tourbillon, Chronograph, Flyback, Moonphase ve Perpetual Calendar kartları, arama ve teknik açıklamalar.
     - `bezeller.html`: Dalgıç, Takimetre ve GMT bezelleri için kullanım kılavuzları, matematiksel formüller ve güvenlik ipuçları.
   - Üst gezinme çubuğu (`.topbar`) ve alt gezinme (`.site-footer`) tüm sayfalarda aktif sayfa vurgusu (`.active`, `aria-current="page"`) ile bağlandı.

2. **Tipografi ve Font Değişimi (Roboto):**
   - Video oyunu havası veren retro fontlar kaldırıldı.
   - Başlıklar, gövde metinleri ve etiketler **Roboto** ve teknik veriler için **Roboto Mono** ile güncellendi.

3. **Mekanizmanın Görünürlük Sorununun Çözümü & Kenar Sınırlarına Tam Oturtulması:**
   - **Görünürlük ve Boyutlandırma Düzeltmesi:** CSS flex yapısında `height: 100%` çakışması ve JavaScript içindeki mükerrer değişken tanımlaması giderildi. Canvas'ın 0x0 piksele çökmesi engellendi; `ResizeObserver` ve güvenli yedek boyutlandırma eklendi.
   - **Sağ ve Sol Kenarların Bölge Sınırlarına Denk Gelmesi:** Saatin sol kenarı (9 yönündeki çelik kasa kenarı) bölgenin sol sınırına (`x = 4px`), sağ kenarı olan kurma kolu ucu ise bölgenin sağ sınırına (`x = width - 4px`) tam denk gelecek şekilde dinamik oranlama formülü (`scale = (width - 8) / 455`) uygulandı.
   - **Dönen Kurma Kolu (Winding Crown):** Saat 3 yönünde kasa koruma omuzları (crown guards), çelik gövde ve 3D tırtık çizgileri (knurling flutes) çizildi. **"Kur"** butonuna basıldığında kurma kolu hızlı ve akıcı bir şekilde döner, zembereği kurar ve güç rezervini artırır. Ayrıca fare/parmak ile sürüklendiğinde de kurma kolu elle çevrilebilir.
   - **Saf Mekanizma (Numaralandırmalar Kaldırıldı):** 1'den 5'e kadar numaralandırılmış tüm yazılar ve oklar kaldırıldı, sadece saf mekanik kalibre ve kasa çerçevesi görünür kılındı.
   - **Genişlik Oranı:** Anasayfada sol mekanizma bölümü %35 genişliktedir.
   - **Ağır Çekim Varsayılanı:** Mekanizma varsayılan olarak **Ağır Çekim (0.25x)** modunda açılır.

4. **Bölüm Kaldırma & Footer Düzenlemesi:**
   - Anasayfadaki *"Bir Mekanik Saatin 5 Organı"* bölümü kaldırıldı.
   - Sitenin tüm sayfalarının altındaki footer alanına *"Bu site eğitim amaçlı hazırlanmış bir içeriktir."* notu eklendi.

5. **Kart Boyutları:**
   - Tüm kartlar daha uzun ve ferah dikey ölçülerle (`min-height: 380px` – `420px`) korundu.
