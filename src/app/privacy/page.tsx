import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy | Reshin Rajesh",
    description: "Privacy policy for reshinrajesh.in",
};

export default function PrivacyPolicy() {
    return (
        <main className="bg-background min-h-screen text-foreground flex flex-col">
            <Navbar />
            <div className="container mx-auto px-6 py-24 flex-grow max-w-4xl relative z-10">
                <h1 className="text-4xl font-bold mb-8 text-foreground font-outfit">Privacy Policy</h1>

                <div className="space-y-8 text-muted-foreground leading-relaxed">
                    <p>
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground font-outfit">1. Information We Collect</h2>
                        <p>
                            We may collect personal information that you provide to us directly, such as when you contact us or subscribe to a newsletter. In addition, we may automatically collect certain information about your device and usage of our website through cookies and analytics tools (such as Vercel Analytics and Speed Insights). This may include your IP address, browser type, operating system, and pages visited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground font-outfit">2. How We Use Your Information</h2>
                        <p>
                            The information we collect is used to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, operate, and maintain our website.</li>
                            <li>Improve, personalize, and expand our website.</li>
                            <li>Understand and analyze how you use our website.</li>
                            <li>Develop new products, services, features, and functionality.</li>
                            <li>Communicate with you for customer service or updates.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground font-outfit">3. Third-Party Services</h2>
                        <p>
                            Our website may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground font-outfit">4. Data Security</h2>
                        <p>
                            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground font-outfit">5. Changes to This Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground font-outfit">6. Contact Us</h2>
                        <p>
                            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
