'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    age: '',
    location: '',
    abilityLevel: '',
    boardSize: '',
    surfConditions: [] as string[],
    photos: [] as string[],
  })
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    age: '',
    location: '',
    abilityLevel: '',
    boardSize: '',
    surfConditions: [] as string[],
    photos: [] as string[],
  })

  useEffect(() => {
    const data = {
      firstName: localStorage.getItem('onboarding_firstName') || '',
      lastName: localStorage.getItem('onboarding_lastName') || '',
      email: localStorage.getItem('onboarding_email') || '',
      mobile: localStorage.getItem('onboarding_mobile') || '',
      age: localStorage.getItem('onboarding_age') || '',
      location: localStorage.getItem('onboarding_location') || '',
      abilityLevel: localStorage.getItem('onboarding_abilityLevel') || '',
      boardSize: localStorage.getItem('onboarding_boardSize') || '',
      surfConditions: JSON.parse(localStorage.getItem('onboarding_surfConditions') || '[]'),
      photos: JSON.parse(localStorage.getItem('onboarding_photos') || '[]'),
    }
    setProfileData(data)
    setEditData(data)
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('onboarding_firstName', editData.firstName)
    localStorage.setItem('onboarding_lastName', editData.lastName)
    localStorage.setItem('onboarding_email', editData.email)
    localStorage.setItem('onboarding_mobile', editData.mobile)
    localStorage.setItem('onboarding_age', editData.age)
    localStorage.setItem('onboarding_location', editData.location)
    localStorage.setItem('onboarding_abilityLevel', editData.abilityLevel)
    localStorage.setItem('onboarding_boardSize', editData.boardSize)
    localStorage.setItem('onboarding_surfConditions', JSON.stringify(editData.surfConditions))
    localStorage.setItem('onboarding_photos', JSON.stringify(editData.photos))
    
    // Update profile data
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newPhotos: string[] = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string)
            if (newPhotos.length === files.length) {
              setEditData(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
              }))
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePhoto = (index: number) => {
    setEditData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const abilityLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced',
    'Expert'
  ]

  const surfConditions = [
    'Small waves (1-3ft)',
    'Medium waves (3-6ft)',
    'Large waves (6ft+)',
    'Beach breaks',
    'Point breaks',
    'Reef breaks',
    'Clean conditions',
    'Choppy conditions',
    'All conditions'
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-16 sm:px-20 lg:px-24 xl:px-32 py-8 sm:py-12" style={{ margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">Profile</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage your surfing preferences and personal information</p>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 my-2">
                Edit Profile
              </Button>
            )}
          </div>
          
          {!isEditing ? (
            // View Mode
            <div className="space-y-8">
              {/* Photos Section */}
              <div className="bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border/30 shadow-lg my-4">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Surf Photos</h2>
                </div>
                {profileData.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {profileData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Surf photo ${index + 1}`}
                          className="w-full h-32 sm:h-40 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-muted-foreground">No photos uploaded yet</p>
                    <p className="text-sm text-muted-foreground">Add some surf photos to show off your skills!</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border/30 shadow-lg my-4">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Personal Information</h2>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Name</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.firstName} {profileData.lastName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Email</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Mobile</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.mobile}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Age</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.age}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border/30 shadow-lg my-4">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Surfing Information</h2>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Location</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.location}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Ability Level</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.abilityLevel}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Board Size</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold">{profileData.boardSize}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">Surf Conditions</span>
                    <span className="text-foreground text-sm sm:text-base font-semibold text-right">{profileData.surfConditions.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
            // Edit Mode
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="space-y-8">
                {/* Photos Upload Section */}
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-600/30 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Surf Photos</h2>
                  </div>
                  
                  {/* Photo Upload */}
                  <div className="mb-6">
                    <Label htmlFor="photos" className="text-white mb-2 block">Upload Photos</Label>
                    <input
                      type="file"
                      id="photos"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all duration-200"
                    />
                    <p className="text-gray-400 text-sm mt-2">Upload up to 4 surf photos to show off your skills!</p>
                  </div>
                  
                  {/* Current Photos */}
                  {editData.photos.length > 0 && (
                    <div>
                      <Label className="text-white mb-3 block">Current Photos</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {editData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={photo} 
                              alt={`Surf photo ${index + 1}`}
                              className="w-full h-32 sm:h-40 object-cover rounded-xl shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-600/30 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={editData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="13"
                        max="120"
                        value={editData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-600/30 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Surfing Information</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="abilityLevel">Ability Level</Label>
                      <select
                        id="abilityLevel"
                        value={editData.abilityLevel}
                        onChange={(e) => handleInputChange('abilityLevel', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select ability level</option>
                        {abilityLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="boardSize">Board Size</Label>
                      <Input
                        id="boardSize"
                        value={editData.boardSize}
                        onChange={(e) => handleInputChange('boardSize', e.target.value)}
                        placeholder="e.g., 6'02"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Surf Conditions</Label>
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {surfConditions.map(condition => (
                          <label key={condition} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editData.surfConditions.includes(condition)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditData(prev => ({
                                    ...prev,
                                    surfConditions: [...prev.surfConditions, condition]
                                  }))
                                } else {
                                  setEditData(prev => ({
                                    ...prev,
                                    surfConditions: prev.surfConditions.filter(c => c !== condition)
                                  }))
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-600/50 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Save Changes
                </Button>
                <Button type="button" onClick={handleCancel} variant="outline" className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200">
                  Cancel
                </Button>
              </div>
            </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 