import { useState, useEffect } from 'react'
import '../css/Home.css'
import { Sparkles, RefreshCw, NotebookPen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import JournalForm from '../components/JournalForm'
import { questions } from '../js/questions'
import { useJournal } from '../context/JournalContext'

function Home() {

  const [question, setQuestion] = useState('')
  const [showQuestion, setShowQuestion] = useState(false)

  // Loading animation
  const [isLoading, setIsLoading] = useState(false)

  // Journals part
  const [showJournalForm, setShowJournalForm] = useState(false)
  const { addJournalEntry } = useJournal()

  const getRandomQuestion = () => {

    setIsLoading(true)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * questions.length)

      setQuestion(questions[randomIndex])
      setShowQuestion(false) // closed, open every time when animation work

      setTimeout(() => {
        setShowQuestion(true)
        setIsLoading(false)
      }, 100)
    }, 200)
  }

  const handleJournalSubmit = (journalData) => {
    addJournalEntry(journalData)
    setShowJournalForm(false)
    // Reset the question state to show the initial view
    setShowQuestion(false)
  }

  return (
    <>
      <div className="container">
        <header className="flex-col text-center max-w-3xl mx-auto mb-16s">
          <h1 className="font-bold leading-tight">
            What would you like to
            <br />
            <span className="header font-semibold">
              reflect today?
            </span>
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Take a moment to pause, breathe, and explore your inner thoughts through guided reflection.
          </p>
        </header>

        {/* Question Section */}
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <div className="card backdrop-blur-sm shadow-xl text-center">
            <div className="card-content py-12">
              <div className='gap-6 flex flex-col items-center'>


                {!showQuestion ? (
                  <>

                    <div className='sparkle w-15 h-15 rounded-full flex items-center justify-center'>
                      <Sparkles className='w-8 h-8 text-white' />
                    </div>

                    <div className=''>
                      <span className='text-2xl font-medium'>Ready to reflect?</span>
                      <p>Get a thoughtful question to guide your journaling today.</p>
                    </div>
                    <button
                      onClick={getRandomQuestion}
                      className='btn flex gap-3'
                    >
                      <Sparkles />
                      <span>Get Today's Question</span>
                    </button>
                  </>
                ) : showJournalForm ? (
                  <JournalForm
                    question={question}
                    onSubmit={handleJournalSubmit}
                  />
                ) : (
                  <>

                    <div className='header-q'>
                      <span className='text-xl font-medium'>Today's Reflection Question</span>
                    </div>
                    <AnimatePresence>
                      {showQuestion && (
                        <motion.div
                          key={question}
                          initial={{ opacity: 0, y: 20, rotate: -5 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          exit={{ opacity: 0, y: -20, rotate: 5 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className='text-lg font-medium '
                        >
                          <div className='q-display flex items-center justify-center text-center w-130 h-20'>
                            <p className='text-lg font-medium'>{question}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className='flex gap-5'>
                      <button
                        onClick={() => {setShowJournalForm(true)}}
                        className='flex items-center gap-2 btn'
                      >
                        <NotebookPen className='w-4 h-4' />
                        <span>Start Writing Journal</span>
                      </button>

                      <button
                        onClick={getRandomQuestion}
                        className='flex items-center gap-2 border-1 py-1 px-3 cursor-pointer rounded-md'
                      >
                        <RefreshCw className=" w-4 h-4" />
                        <span>Get New Question</span>
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>

    </>

  )
}
export default Home