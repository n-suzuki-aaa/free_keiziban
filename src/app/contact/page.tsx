import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <section className="rounded border border-gray-200 bg-white p-6">
        <h1 className="mb-4 text-lg font-bold">お問い合わせ</h1>
        <ContactForm />
      </section>
    </div>
  );
}
