import aboutImg from '../assets/images/about-img.jpg'

function About() {

  const features = [
    { title: "Daily Questions", desc: "Get new thought-provoking prompts every day." },
    { title: "Save Your Journal", desc: "Keep your reflections organized and secure." },
    { title: "Mood Selector", desc: "Choose a mood that fits your vibe." },
  ];

  return (
    <div className="container px-4 mb-20">

      {/* Header */}
      <header className="text-center max-w-screen-md mx-auto mb-14">
        <h2 className="text-4xl font-bold leading-tight mb-6">
          ✨ About Us
        </h2>
        <p className="text-md font-normal">
          At <span className="font-bold">TodayIFeel</span>, we believe that every day is a new opportunity to understand ourselves better.
        </p>
      </header>

      {/* Card Section */}
      <div className="card shadow-md rounded-lg overflow-hidden">
        <div className="card-content flex flex-col md:flex-row justify-between gap-8 px-6 py-10 ">

          {/* Text Section */}
          <div className="text md:w-1/2">
            <h3 className="font-medium text-2xl mb-4">Main Concept</h3>
            <p>
              This platform was created to make self-reflection easier, more accessible, and more meaningful.
              We provide thought-provoking questions each day to help you explore your feelings, experiences,
              and growth. Whether you’re starting your journaling journey or continuing a long-time habit, our
              goal is to support you in creating a deeper connection with yourself.
            </p>
            <br />
            <p>
              We know that even the same question can spark a different insight depending on how you feel that
              day — and that’s the beauty of reflection.
            </p>
            <br />
            <span className='font-semibold'>- ToDayIFeel</span>
          </div>

          {/* Image Section */}
          <div className="img md:w-1/2 flex justify-center md:justify-end">
            <img src={aboutImg} className="w-80 h-80 rounded-md object-cover" alt="About" />
          </div>

        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center mt-12">
        {features.map((feature, idx) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
            <p className="text-md">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="card py-8 text-center mt-15">
        <h3 className="text-2xl font-bold mb-4">Start Your Journey Today</h3>
        <p className="mb-6">Reflect on your thoughts, one question at a time.</p>
        <a href="/" className="btn">Go to Home</a>
      </div>

    </div>
  )
}
export default About