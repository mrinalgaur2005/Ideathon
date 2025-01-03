'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

interface MarkerData {
  student_id: string
  latitude: number
  longitude: number
  distance?: number // Distance in km
}

const OpenStreetmap: React.FC = () => {
  const [center, setCenter] = useState<LatLngExpression>({ lat: 30.7652305, lng: 76.7846207 })
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null)
  const [markers, setMarkers] = useState<Record<string, MarkerData>>({})
  const [studentId, setStudentId] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)
  const userLocationRef = useRef<LatLngExpression | null>(null)
  const ZOOM_LEVEL = 10
  const sendLocationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Rectangle bounds
  const RECTANGLE_BOUNDS = {
    minLatitude: Math.min(30.762473, 30.766436, 30.770325, 30.767316),
    maxLatitude: Math.max(30.762473, 30.766436, 30.770325, 30.767316),
    minLongitude: Math.min(76.782157, 76.779274, 76.790160, 76.791514),
    maxLongitude: Math.max(76.782157, 76.779274, 76.790160, 76.791514),
  }

  // Function to calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000 // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in meters
  }

  // Function to check if coordinates are within the rectangle
  const isWithinRectangle = (latitude: number, longitude: number): boolean => {
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } = RECTANGLE_BOUNDS
    return (
      latitude >= minLatitude &&
      latitude <= maxLatitude &&
      longitude >= minLongitude &&
      longitude <= maxLongitude
    )
  }

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getStudentId')
        if (response.data?.student_id) {
          const fetchedStudentId = response.data.student_id
          setStudentId(fetchedStudentId)
          localStorage.setItem('studentId', fetchedStudentId)
          console.log('Fetched Student ID:', fetchedStudentId)
        } else {
          console.error('Student ID is empty in API response')
        }
      } catch (error) {
        console.error('Failed to fetch student ID:', error)
      }
    }

    const storedStudentId = localStorage.getItem('studentId')
    if (storedStudentId) {
      setStudentId(storedStudentId)
      console.log('Using stored Student ID:', storedStudentId)
    } else {
      fetchStudentId()
    }
  }, [])

  useEffect(() => {
    if (!studentId) return

    const socket = new WebSocket('ws://localhost:3000')
    wsRef.current = socket

    socket.onopen = () => {
      console.log('Connected to WebSocket server')
      sendLocation()
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received data:', data)

        if (data.latitudeData && data.latitudeData.length > 0) {
          const updatedMarkers: Record<string, MarkerData> = {}
          data.latitudeData.forEach((marker: any) => {
            if (isWithinRectangle(marker.latitude, marker.longitude)) {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    marker.latitude,
                    marker.longitude
                  )
                : null
              updatedMarkers[marker.student_id] = {
                student_id: marker.student_id,
                latitude: marker.latitude,
                longitude: marker.longitude,
                distance: distance ? parseFloat((distance / 1000).toFixed(2)) : undefined, // Convert to km
              }
            }
          })
          setMarkers(updatedMarkers)
        } else {
          setMarkers({})
          console.log('No friends found or outside the rectangle.')
        }
        sendLocation()
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [studentId, userLocation])

  useEffect(() => {
    const geoSuccess = (position: GeolocationPosition) => {
      const userLoc = { lat: position.coords.latitude, lng: position.coords.longitude }
      setUserLocation(userLoc)
      userLocationRef.current = userLoc
      setCenter(userLoc)
      sendLocation()
    }

    const geoError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error.message)
      setUserLocation({ lat: 0, lng: 0 })
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(geoSuccess, geoError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    } else {
      console.warn('Geolocation not supported by the browser')
    }
  }, [])

  const sendLocation = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && userLocationRef.current) {
      if (sendLocationTimeout.current) clearTimeout(sendLocationTimeout.current)

      sendLocationTimeout.current = setTimeout(() => {
        const locationData = {
          student_id: studentId,
          latitude: userLocationRef.current.lat,
          longitude: userLocationRef.current.lng,
        }
        wsRef.current.send(JSON.stringify(locationData))
        console.log('Sent location data:', locationData)
      }, 1000)
    } else {
      console.warn('WebSocket not open or user location not available')
    }
  }

  // Custom map icons
  const customIcon = new L.Icon({
    iconUrl: 'https://res.cloudinary.com/dlinkc1gw/image/upload/v1735823181/qq0ndgdcexmxhxnnbgln.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, 32],
  })

  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, 32],
  })

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render friends' markers */}
      {Object.values(markers).map((marker) => (
        <Marker
          key={marker.student_id}
          position={[marker.latitude, marker.longitude]}
          icon={customIcon}
        >
          <Popup>
            Friend ID: {marker.student_id}
            <br />
            Distance: {marker.distance ? `${marker.distance} km` : 'Calculating...'}
          </Popup>
        </Marker>
      ))}

      {/* Render user's location */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            Your location
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default OpenStreetmap
