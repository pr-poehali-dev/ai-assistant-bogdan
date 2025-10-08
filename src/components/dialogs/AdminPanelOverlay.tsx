import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AdminPanel from '@/components/AdminPanel';

interface AdminPanelOverlayProps {
  show: boolean;
  apiConfig: any;
  onClose: () => void;
  onAPIKeyChange: (model: string, key: string) => void;
  onToggleModel: (model: string, enabled: boolean) => void;
  onSaveSettings: () => void;
}

export default function AdminPanelOverlay({
  show,
  apiConfig,
  onClose,
  onAPIKeyChange,
  onToggleModel,
  onSaveSettings
}: AdminPanelOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-xl bg-white/80 hover:bg-white"
          >
            <Icon name="X" size={20} />
          </Button>
          <AdminPanel
            apiConfig={apiConfig}
            onAPIKeyChange={onAPIKeyChange}
            onToggleModel={onToggleModel}
            onSaveSettings={onSaveSettings}
          />
        </div>
      </div>
    </div>
  );
}
