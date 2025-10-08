// src/pages/TermsAndConditions.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Scale, Lock, Globe, Mail, Phone } from "lucide-react";

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "account", title: "Account Registration" },
    { id: "orders", title: "Orders & Payments" },
    { id: "products", title: "Products Information" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "returns", title: "Returns & Refunds" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "user-content", title: "User Content" },
    { id: "privacy", title: "Privacy & Data" },
    { id: "limitation", title: "Limitation of Liability" },
    { id: "termination", title: "Termination" },
    { id: "governing", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact Information" }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-amber-900">Terms & Conditions</h1>
              <p className="text-amber-700">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-8">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-amber-100 text-amber-700 font-semibold border-l-4 border-amber-500"
                        : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8">
              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-amber-600" />
                  1. Introduction
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Welcome to ChocoNut! These Terms and Conditions govern your use of our website 
                    located at www.choconut.com and our services. By accessing or using our platform, 
                    you agree to be bound by these Terms and our Privacy Policy.
                  </p>
                  <p>
                    ChocoNut ("we," "our," or "us") operates an e-commerce platform specializing in 
                    premium food products, including chocolates, nuts, and related gourmet items. 
                    Our services include product sales, delivery, and customer support.
                  </p>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="text-amber-800 font-medium">
                      Please read these Terms carefully before using our services. If you disagree 
                      with any part of these Terms, you may not access our platform.
                    </p>
                  </div>
                </div>
              </section>

              {/* Definitions */}
              <section id="definitions" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">2. Definitions</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>"Platform"</strong> refers to the ChocoNut website, mobile application, and related services.</p>
                  <p><strong>"User"</strong> refers to any individual or entity accessing our Platform.</p>
                  <p><strong>"Customer"</strong> refers to Users who purchase products through our Platform.</p>
                  <p><strong>"Products"</strong> refers to goods available for purchase on our Platform.</p>
                  <p><strong>"Content"</strong> includes text, images, reviews, and other materials posted on the Platform.</p>
                </div>
              </section>

              {/* Account Registration */}
              <section id="account" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-amber-600" />
                  3. Account Registration
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>To access certain features, you must register for an account. You agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                    <li>Notify us immediately of any security breach or unauthorized use</li>
                    <li>Be responsible for all activities that occur under your account</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate accounts that provide false information 
                    or violate these Terms.
                  </p>
                </div>
              </section>

              {/* Orders & Payments */}
              <section id="orders" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">4. Orders & Payments</h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Order Acceptance:</strong> All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.</p>
                  <p><strong>Pricing:</strong> Prices are shown in Indian Rupees (₹) and include applicable taxes. We reserve the right to change prices without notice.</p>
                  <p><strong>Payment:</strong> We accept various payment methods including credit/debit cards, UPI, net banking, and wallet payments.</p>
                  <p><strong>Order Confirmation:</strong> You will receive an email confirmation once your order is successfully placed.</p>
                </div>
              </section>

              {/* Products Information */}
              <section id="products" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">5. Products Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We strive to display product information accurately, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Product descriptions, images, and specifications</li>
                    <li>Nutritional information and ingredients</li>
                    <li>Allergen warnings and storage instructions</li>
                    <li>Manufacturing and expiry dates</li>
                  </ul>
                  <p>
                    However, we cannot guarantee that product descriptions or other content are 
                    completely accurate, reliable, or error-free.
                  </p>
                </div>
              </section>

              {/* Shipping & Delivery */}
              <section id="shipping" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">6. Shipping & Delivery</h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Delivery Areas:</strong> We currently deliver across India. Delivery timelines vary by location.</p>
                  <p><strong>Shipping Costs:</strong> Shipping fees are calculated based on delivery location and order value.</p>
                  <p><strong>Delivery Times:</strong> Estimated delivery times are provided but not guaranteed.</p>
                  <p><strong>Risk of Loss:</strong> All items purchased are made pursuant to a shipment contract.</p>
                </div>
              </section>

              {/* Returns & Refunds */}
              <section id="returns" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">7. Returns & Refunds</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Our return policy includes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>10-day return policy for damaged or incorrect items</li>
                    <li>Refunds processed within 5-7 business days</li>
                    <li>Return shipping costs covered by us for defective products</li>
                    <li>Perishable goods may have different return conditions</li>
                  </ul>
                </div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">8. Intellectual Property</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    All content on this Platform, including text, graphics, logos, images, and software, 
                    is the property of ChocoNut or its content suppliers and protected by copyright laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, or create derivative works without our 
                    express written permission.
                  </p>
                </div>
              </section>

              {/* User Content */}
              <section id="user-content" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">9. User Content</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By submitting content (reviews, comments, photos), you grant us a non-exclusive, 
                    royalty-free license to use, modify, and display such content.
                  </p>
                  <p>You agree not to post content that:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Is unlawful, offensive, or inappropriate</li>
                    <li>Infringes on third-party rights</li>
                    <li>Contains viruses or malicious code</li>
                    <li>Is false or misleading</li>
                  </ul>
                </div>
              </section>

              {/* Privacy & Data */}
              <section id="privacy" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-amber-600" />
                  10. Privacy & Data Protection
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your privacy is important to us. Please review our Privacy Policy to understand 
                    how we collect, use, and protect your personal information.
                  </p>
                  <p>
                    We implement security measures to protect your data, but cannot guarantee 
                    absolute security of information transmitted to our Platform.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section id="limitation" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">11. Limitation of Liability</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    To the fullest extent permitted by law, ChocoNut shall not be liable for any 
                    indirect, incidental, special, or consequential damages resulting from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your use or inability to use the Platform</li>
                    <li>Unauthorized access to your transmissions or data</li>
                    <li>Statements or conduct of any third party on the Platform</li>
                    <li>Any other matter relating to the Platform</li>
                  </ul>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">12. Termination</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may terminate or suspend your account and access to the Platform immediately, 
                    without prior notice, for conduct that we believe violates these Terms or is 
                    harmful to other users, us, or third parties.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section id="governing" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-amber-600" />
                  13. Governing Law
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of 
                    India, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes shall be subject to the exclusive jurisdiction of the courts 
                    located in Mumbai, Maharashtra.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">14. Changes to Terms</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users 
                    of significant changes through email or platform notifications.
                  </p>
                  <p>
                    Continued use of the Platform after changes constitutes acceptance of the 
                    modified Terms.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">15. Contact Information</h2>
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Email Support
                      </h3>
                      <p className="text-amber-700">support@choconut.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                        <Phone className="w-5 h-5 mr-2" />
                        Customer Care
                      </h3>
                      <p className="text-amber-700">+91-1800-123-4567</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <p className="text-amber-700">
                      For questions about these Terms, please contact our legal department at 
                      legal@choconut.com
                    </p>
                  </div>
                </div>
              </section>

              {/* Acceptance Section */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Acceptance of Terms</h3>
                <p className="opacity-90">
                  By using our Platform, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}