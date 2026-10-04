import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone, User } from "lucide-react";

export default function ContactPage() {
  const contacts = [
    {
      name: "Obang Ogoni",
      phone: "+31647799748",
      email: "Obangogoni@gamil.com",
    },
    {
      name: "Steven Trimon",
      phone: "+31618703008",
      email: "Steventrimon@gmail.com",
    },
    {
      name: "Ruun Obang",
      phone: "+31683049223",
      email: "Ruun_omot@yahoo.com",
    },
    {
      name: "Ajaw Odol",
      phone: "+251917833712",
      email: "Odologuak@yahoo.com",
    },
    {
      name: "Ashini Astin",
      phone: "+251913623040",
      email: null,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Contact our representatives for questions about mineral resources,
          gold mining activities and other matters related to the Gambella
          region.
        </p>
      </div>

      {/* Location Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gambella, Ethiopia</p>
          <p className="text-sm text-muted-foreground mt-2">
            For specific addresses and office locations, contact one of our
            representatives below.
          </p>
        </CardContent>
      </Card>

      {/* Contact Representatives */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">Representatives</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card
              key={contact.name}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  {contact.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm hover:text-primary transition-colors break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            • All representatives are available for questions about mineral
            resources
          </p>
          <p>• For urgent matters, contact directly by phone</p>
          <p>• Emails are answered within 24-48 hours during business days</p>
          <p>• For official documents and reports, visit our documents page</p>
        </div>
      </div>
    </div>
  );
}
