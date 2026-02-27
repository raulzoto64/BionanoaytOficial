import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ContactInfo {
  phone: string;
  email: string;
  location: string;
}

interface FooterProps {
  contactInfo: ContactInfo;
}

export function Footer({ contactInfo }: FooterProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Mensaje enviado! Nos pondremos en contacto pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <footer className="bg-[#1C5D15] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h3 className="text-3xl mb-6">Contáctanos</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Mensaje"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
              >
                Enviar Mensaje
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-3xl mb-6">Información</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#19FF00]/20 rounded-lg">
                  <Phone className="w-6 h-6 text-[#19FF00]" />
                </div>
                <div>
                  <h4 className="mb-1">Teléfono</h4>
                  <p className="text-white/80">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#19FF00]/20 rounded-lg">
                  <Mail className="w-6 h-6 text-[#19FF00]" />
                </div>
                <div>
                  <h4 className="mb-1">Email</h4>
                  <p className="text-white/80">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#19FF00]/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#19FF00]" />
                </div>
                <div>
                  <h4 className="mb-1">Ubicación</h4>
                  <p className="text-white/80">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Bionanoaxus. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
