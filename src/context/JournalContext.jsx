import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../js/supabaseClient'
import useUser from '../hooks/useUser'

const JournalContext = createContext()

export function JournalProvider({ children }) {
    const [journalEntries, setJournalEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useUser()

    // Fetch journal entries from Supabase
    useEffect(() => {
        if (user) {
            fetchJournalEntries()
        } else {
            setJournalEntries([])
            setLoading(false)
        }
    }, [user])

    const fetchJournalEntries = async () => {
        try {
            setLoading(true)
            setError(null)
            
            if (!user) {
                console.log('No user found')
                return
            }

            console.log('Fetching journals for user:', user.id)
            
            const { data, error } = await supabase
                .from('journals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Supabase error:', error)
                throw error
            }

            console.log('Fetched journals:', data)
            setJournalEntries(data || [])
        } catch (err) {
            console.error('Error fetching journal entries:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Add new journal entry
    const addJournalEntry = async (entry) => {
        try {
            setError(null)
            
            if (!user) {
                throw new Error('User not authenticated')
            }

            const { data, error } = await supabase
                .from('journals')
                .insert([
                    {
                        user_id: user.id,
                        question: entry.question,
                        mood: entry.mood,
                        content: entry.content,
                        date: entry.date || new Date().toISOString()
                    }
                ])
                .select()

            if (error) {
                console.error('Supabase error:', error)
                throw error
            }

            console.log('Added journal:', data)
            setJournalEntries(prev => [data[0], ...prev])
            return data[0]
        } catch (err) {
            console.error('Error adding journal entry:', err)
            setError(err.message)
            throw err
        }
    }

    // Delete journal entry
    const deleteJournalEntry = async (id) => {
        try {
            setError(null)
            
            if (!user) {
                throw new Error('User not authenticated')
            }

            const { error } = await supabase
                .from('journals')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) {
                console.error('Supabase error:', error)
                throw error
            }

            setJournalEntries(prev => prev.filter(entry => entry.id !== id))
        } catch (err) {
            console.error('Error deleting journal entry:', err)
            setError(err.message)
            throw err
        }
    }

    return (
        <JournalContext.Provider value={{
            journalEntries,
            loading,
            error,
            addJournalEntry,
            deleteJournalEntry,
            refreshEntries: fetchJournalEntries
        }}>
            {children}
        </JournalContext.Provider>
    )
}

export function useJournal() {
    const context = useContext(JournalContext)
    if (!context) {
        throw new Error('useJournal must be used within a JournalProvider')
    }
    return context
}