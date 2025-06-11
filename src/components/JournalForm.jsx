import { useState, useEffect } from "react"
import useUser from "../hooks/useUser"
import { useNavigate } from "react-router-dom"
import { supabase } from "../js/supabaseClient"

function JournalForm({ question, onSubmit }) {
    const [mood, setMood] = useState('neutral')
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const { user, loading } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth')
            alert('Please log in to start writing your journal.')
        }
    }, [user, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!user) {
            navigate('/auth')
            return
        }

        try {
            const { data, error } = await supabase
                .from('journals')
                .insert([
                    {
                        user_id: user.id,
                        question,
                        mood,
                        content,
                        date: new Date().toISOString()
                    }
                ])
                .select()

            if (error) {
                setError(error.message)
            } else {
                alert('Journal saved!')
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Today's Question</h3>
                <p className="text-lg">" {question} "</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-medium">How are you feeling?</label>
                <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="custom-select p-2 border rounded-md"
                >
                    <option value="happy">😊 Happy</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😢 Sad</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="anxious">😰 Anxious</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-medium">Your Journal Entry</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="p-3 border rounded-md min-h-[100px]"
                    placeholder="Write your thoughts here..."
                    required
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="btn"
                disabled={!content.trim()}
            >
                Save Your Journal
            </button>
        </form>
    );
}

export default JournalForm