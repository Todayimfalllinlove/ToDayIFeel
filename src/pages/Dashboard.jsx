import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJournal } from '../context/JournalContext'
import useUser from "../hooks/useUser"
import { Trash2, Loader2 } from 'lucide-react'
import { supabase } from '../js/supabaseClient'
import UserProfile from '../components/UserProfile'

function Dashboard() {
    const { journalEntries, deleteJournalEntry, loading: journalLoading, error } = useJournal()
    const { user, loading: userLoading } = useUser()
    const navigate = useNavigate()

    const [profile, setProfile] = useState({ full_name: '', avatar_url: '' })
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUsername(user)

            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
            }

            setLoading(false)
        }

        fetchProfile()
    }, [user])


    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/auth')
        }
    }, [user, userLoading, navigate])

    const getMoodEmoji = (mood) => {
        const emojis = {
            happy: '😊',
            neutral: '😐',
            sad: '😢',
            excited: '🤩',
            anxious: '😰'
        };
        return emojis[mood] || '😐'
    }

    if (userLoading || journalLoading) {
        return (
            <div className="container flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null
    }


    return (
        <div className="container mb-20">

            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-around">

                {/* User Profile */}
                <div className="w-full md:w-1/3">
                    <UserProfile user={user} profile={profile} setProfile={setProfile} />
                </div>

                {/* Journals */}
                <div className="journals w-full md:w-2/3">
                    <h2 className="text-4xl font-bold leading-tight mb-6 text-center">Your Journal Entries</h2>

                    {journalEntries.length === 0 ? (
                        <div className="text-center">
                            <p>No journal entries yet. Start writing your first entry!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 ">
                            {journalEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="card backdrop-blur-sm shadow-xl p-6 relative"
                                >
                                    <button
                                        onClick={() => deleteJournalEntry(entry.id)}
                                        className="absolute bottom-5 right-5 cursor-pointer hover:text-red-500 transition-colors"
                                        title="Delete entry"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>

                                    <div className="flex gap-5 items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-medium mb-2">{entry.question}</h3>
                                            <p>
                                                {new Date(entry.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                                    </div>
                                    <div className="prose max-w-none">
                                        <span className="whitespace-pre-wrap text-lg">{entry.content}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;