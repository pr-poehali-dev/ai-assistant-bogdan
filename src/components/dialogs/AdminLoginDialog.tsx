import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passwordInput: string;
  onPasswordChange: (password: string) => void;
  onLogin: () => void;
}

export default function AdminLoginDialog({
  open,
  onOpenChange,
  passwordInput,
  onPasswordChange,
  onLogin,
}: AdminLoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="Lock" size={32} className="text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Вход в систему</DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Введите пароль для доступа к панели управления
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            type="password"
            placeholder="Пароль"
            value={passwordInput}
            onChange={(e) => onPasswordChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onLogin()}
            className="h-12 rounded-xl border-slate-200"
          />
          <Button
            onClick={onLogin}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg font-medium"
          >
            Войти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
