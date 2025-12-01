import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Smart Content Manager
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Generate AI-powered social media content, captions, product descriptions and 30-day content
          plans. Save, organize, and manage everything in one simple dashboard.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/signup"
            className="px-5 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50"
          >
            Log In
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">AI Content Generator</h3>
          <p className="text-gray-600">
            Quickly create ideas, captions, product descriptions, and content plans tailored to your
            audience.
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Dashboard & Calendar</h3>
          <p className="text-gray-600">
            See how much content you generated, manage posts, and plan what to publish next.
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Free & Premium Plans</h3>
          <p className="text-gray-600">
            Start free with monthly limits, then upgrade to unlock unlimited AI requests and saves.
          </p>
        </div>
      </section>
    </div>
  );
}
