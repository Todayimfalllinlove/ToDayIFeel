import React, { useState, useRef } from 'react'
import { supabase } from '../js/supabaseClient'
import { Upload, Edit2 } from 'lucide-react'

export default function UserProfile({ user, profile, setProfile }) {
    const [isEditing, setIsEditing] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const [tempFullName, setTempFullName] = useState(profile.full_name); // temporary state for fullName

    React.useEffect(() => {
        setTempFullName(profile.full_name);
    }, [profile.full_name]);

    const handleSave = async () => {
        if (!user || !user.id) {
            alert('User not authenticated.')
            return

        } try {
            setUploading(true)
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' })
            if (error) {
                throw error
            }

            setProfile(prevProfile => ({
                ...prevProfile,
                full_name: tempFullName 
            }))

            alert('Username updated!')
            setIsEditing(false)

        } catch (error) {
            console.error('Error saving profile:', error.message)
            alert(`Error saving profile: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleAvatarUpload = async (event) => {

        if (!user || !user.id) {
            alert('User not authenticated for avatar upload.');
            return;
        }

        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `avatar.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filePath)

            const publicUrl = publicUrlData?.publicUrl

            if (!publicUrl)
                throw new Error('Could not get public URL for the uploaded file.')

            // **Important:** Add Cache Buster for Browser can reload image every time.
            const finalAvatarUrl = `${publicUrl}?t=${Date.now()}`;

            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: finalAvatarUrl,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' })

            if (updateError) {
                throw updateError
            }

            if (updateError) throw updateError

            setProfile(prevProfile => ({
                ...prevProfile,
                avatar_url: finalAvatarUrl
            }))

            alert('Avatar updated successfully!');

        } catch (error) {
            console.error('Error uploading avatar:', error.message)
            alert(`Error uploading avatar: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="profile flex flex-col items-center">
            <div>
                <h2 className="text-2xl font-bold mb-4">My Profile</h2>

                <div className="space-y-4">
                    {!isEditing ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="avatar"
                                        className="w-30 h-30 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="upload absolute bottom-0 right-0 rounded-full p-1 shadow-md "
                                    title="Change avatar"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <h3 className="text-lg font-medium">{profile.full_name || 'No name set'}</h3>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="border p-2 w-full rounded"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="btn"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="btn bg-gray-200 hover:bg-gray-300"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
