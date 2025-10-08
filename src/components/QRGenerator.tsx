import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function QRGenerator() {
  const { toast } = useToast();
  const [qrImage, setQrImage] = useState('');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [activeTab, setActiveTab] = useState('text');

  const generateQR = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите данные для QR-кода',
        variant: 'destructive',
      });
      return;
    }

    try {
      const qrDataUrl = await QRCode.toDataURL(content, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrImage(qrDataUrl);
      toast({
        title: 'Готово!',
        description: 'QR-код успешно создан',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать QR-код',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateText = () => generateQR(textContent);
  const handleGenerateURL = () => generateQR(urlContent);
  const handleGenerateWiFi = () => generateQR(`WIFI:T:WPA;S:${wifiSSID};P:${wifiPassword};;`);
  const handleGeneratePhone = () => generateQR(`tel:${phoneNumber}`);
  const handleGenerateEmail = () => generateQR(`mailto:${emailAddress}`);

  const handleDownload = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            <Icon name="QrCode" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Генератор QR-кодов</h1>
            <p className="text-slate-600">Создавайте QR-коды для текста, ссылок, Wi-Fi и контактов</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="text">Текст</TabsTrigger>
            <TabsTrigger value="url">Ссылка</TabsTrigger>
            <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
            <TabsTrigger value="phone">Телефон</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Введите любой текст..."
              className="min-h-32"
            />
            <Button onClick={handleGenerateText} className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
              <Icon name="QrCode" size={20} className="mr-2" />
              Создать QR-код
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <Input
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              placeholder="https://example.com"
            />
            <Button onClick={handleGenerateURL} className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
              <Icon name="QrCode" size={20} className="mr-2" />
              Создать QR-код
            </Button>
          </TabsContent>

          <TabsContent value="wifi" className="space-y-4">
            <Input
              value={wifiSSID}
              onChange={(e) => setWifiSSID(e.target.value)}
              placeholder="Название сети (SSID)"
            />
            <Input
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Пароль"
              type="password"
            />
            <Button onClick={handleGenerateWiFi} className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
              <Icon name="QrCode" size={20} className="mr-2" />
              Создать QR-код
            </Button>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
            <Button onClick={handleGeneratePhone} className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
              <Icon name="QrCode" size={20} className="mr-2" />
              Создать QR-код
            </Button>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Input
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="example@email.com"
              type="email"
            />
            <Button onClick={handleGenerateEmail} className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
              <Icon name="QrCode" size={20} className="mr-2" />
              Создать QR-код
            </Button>
          </TabsContent>
        </Tabs>
      </Card>

      {qrImage && (
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Ваш QR-код</h3>
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Icon name="Download" size={20} />
              Скачать PNG
            </Button>
          </div>
          <div className="flex justify-center bg-slate-50 rounded-xl p-8">
            <img src={qrImage} alt="QR Code" className="w-64 h-64" />
          </div>
        </Card>
      )}
    </div>
  );
}
