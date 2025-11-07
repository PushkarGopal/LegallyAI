import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-secondary/50 py-16 sm:py-24">
      <div className="container mx-auto max-w-screen-md px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground pt-2">Last updated: July 29, 2024</p>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground">
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
              <p className="font-bold">Disclaimer:</p>
              <p>This is a template privacy policy and not legal advice. You must consult with a qualified legal professional to ensure this policy is appropriate for your business and compliant with all applicable laws.</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl text-foreground">1. Introduction</h2>
              <p>
                Welcome to LegallyAI ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl text-foreground">2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the platform includes:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, and demographic information, such as your location, that you voluntarily give to us when you register with the platform.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the platform.
                </li>
                <li>
                  <strong>Financial Data:</strong> We do not store any financial information. All financial information is processed by our payment processor.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl text-foreground">3. Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the platform to:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Create and manage your account.</li>
                <li>Match you with legal professionals.</li>
                <li>Email you regarding your account or order.</li>
                <li>Enable user-to-user communications.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the platform.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl text-foreground">4. Disclosure of Your Information</h2>
              <p>
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                </li>
                <li>
                  <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.
                </li>
                <li>
                  <strong>With Lawyers on the Platform:</strong> When you request a consultation or an engagement, we will share your relevant case information with the lawyer(s) to facilitate the service.
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-semibold text-xl text-foreground">5. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl text-foreground">6. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us using the information provided on our contact page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
