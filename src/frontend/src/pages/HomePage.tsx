import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { FileText, Mountain, Phone, Shield, Upload, Users } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Mountain,
      title: "Mineral Resources",
      description:
        "Management and development of gold and other mineral reserves in the Gambella region.",
    },
    {
      icon: Shield,
      title: "Regulation & Compliance",
      description:
        "Ensuring compliance with all environmental regulations and safety standards.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Collaboration with local communities for sustainable development.",
    },
    {
      icon: FileText,
      title: "Transparent Documentation",
      description:
        "Access to important documents and reports about our activities.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-gold/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">G.D.M.R.A.</span>
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-muted-foreground mb-8">
              Gambella Dimuuy Mineral Resources Agency
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Welcome to the Gambella Dimuuy Mineral Resources Agency. We are
              dedicated to the responsible management of mineral resources and
              promoting sustainable development in our region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/documents">
                  <FileText className="mr-2 h-5 w-5" />
                  View & Upload Documents
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Responsible development of mineral resources while protecting the
              interests of the community and the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Access & Upload Important Documents
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            View and download our official documentation about gold mining
            activities, environmental guidelines and regulations. Upload new
            documents to make them available for customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link to="/documents">
                <FileText className="mr-2 h-5 w-5" />
                View Documents
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/documents">
                <Upload className="mr-2 h-5 w-5" />
                Upload Documents
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
