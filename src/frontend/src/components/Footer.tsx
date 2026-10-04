import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Agency Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">G.D.M.R.A.</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Gambella Dimuuy Mineral Resources Agency
            </p>
            <p className="text-sm text-muted-foreground">
              Responsible for the management and development of mineral
              resources in the Gambella region.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Gambella, Ethiopia</p>
              <p>
                For detailed contact information, visit our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Gold mine documentation</p>
              <p>Regulations and guidelines</p>
              <p>Environmental guidelines</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            © 2025. Built with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-current" /> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
