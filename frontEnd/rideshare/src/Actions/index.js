import store from '../store'
export const CONCERTS_RECEIVED = 'CONCERTS_RECEIVED'
export function fetchConcert(e) {
  console.log('fetchConcert');
  e.preventDefault()
 let zipCode = document.getElementsByClassName('zipCode')[0].value
 if(!zipCode){return}
 let radius = document.getElementsByClassName('radius')[0].value
 if(radius === "") {
   radius = '20'
 }
 return async (dispatch) => {
   const response = await fetch(`http://api.jambase.com/events?zipCode=${zipCode}&radius=${radius}&page=0&api_key=3eg5zjnkxt8gpv29ef2b944g`)
   // console.log(response)
   const json = await response.json()
   dispatch({
     type: CONCERTS_RECEIVED,
     concerts: json.Events
   })
 }
}

export const OFFER_RIDE = 'OFFER_RIDE'
export function offerRide(e) {
  console.log(e.target)
  e.preventDefault()
  console.log(e.target.class)
  return async (dispatch) => {
    dispatch({
      type: OFFER_RIDE,
      id: e.target.id,
      inDashboard: false,
    })
  }
}

export const POST_OFFER_RIDE = 'POST_OFFER_RIDE'
export function postOfferRide(e) {
  e.preventDefault()
  let a = store.getState().concertReducer.concerts
  let concert = a.filter(ele=> {
    if(ele.Id == e.target.id) {
      return ele
    }
  })
  //concert info
  let concert_id = concert[0].Id
  let date_time = concert[0].Date
  let venue_name = concert[0].Venue.Name
  let venue_address = concert[0].Venue.Address
  let artists = concert[0].Artists[0].Name
  //person info
  let driverName = e.target.Username.value
  let email = e.target.Email.value
  let phone = e.target.Phone.value.toString()
  let availableSeats = e.target.Seats.value.toString()
  let person_address = e.target.Address.value
  let departingTime = e.target.Departing.value
  let comments = e.target.Comments.value
  let jwt = localStorage.getItem('token')
  console.log(availableSeats,typeof(person_address))
  console.log(jwt)
  return async (dispatch) => {
    const response = await fetch('http://localhost:5000/rides', {
      method: 'POST',
      body: JSON.stringify({concert_id: concert_id,
      date_time: date_time,
      venue_name:venue_name,
      venue_address:venue_address,
      artists: artists,
      driverName: driverName,
      email: email,
      phone: phone,
      availableSeats: availableSeats,
      person_address: person_address,
      departingTime: departingTime,
      comments: comments,
      jwt: jwt,
    }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const offerRide = await response.json()
    if(response.status === 200) {
      window.Materialize.toast('Rides Offered Successful', 2000)
    }
    dispatch({
      type: POST_OFFER_RIDE,
      inofferRide: true,
    })
  }
}

export const POST_SIGN_UP = 'POST_SIGN_UP'
export function signUpPost(e) {
  e.preventDefault()
  let name = e.target.userName.value
  let email = e.target.email.value
  let password = e.target.password.value
  let confirmPassword = e.target.confirmPassword.value
  let phoneNumber = e.target.phoneNumber.value
  if(password !== confirmPassword){
    window.Materialize.toast('Password doesnt match', 3000)
    e.target.password.value = ""
    e.target.confirmPassword.value= ""
    return
  }
  return async (dispatch) => {
    console.log(name)
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      body: JSON.stringify({username: name, email: email, phone_number: phoneNumber, password: password}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    // console.log(response)
    const newUser = await response.json()
    console.log(newUser)
    if(response.status === 200) {
      localStorage.setItem('token', newUser.token)
    }
    dispatch({
      type: POST_SIGN_UP,
      newUser: newUser,
      isSignUp: true
    })
  }
}
export const POST_SIGN_IN = 'POST_SIGN_IN'
export function postSignIn(e) {
  e.preventDefault()
  console.log('in post signin')
  let email = e.target.email.value
  let password = e.target.password.value
  console.log(email, password)
  return async (dispatch) => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({email: email, password: password}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    console.log(response)
    if(response.status !== 200) {
      window.Materialize.toast('please check your credentials', 3000)
      return
    }
    const user = await response.json()
    if(response.status === 200) {
      localStorage.setItem('token', user.token)
    }
    dispatch({
      type: POST_SIGN_IN,
      response: response.status,
      isSignIn: true,
    })
  }
}

export const NEED_RIDE = 'NEED_RIDE'
export function needRide(e) {
  console.log(e.target.id)
  let id = e.target.id
  console.log('herer')
  return async (dispatch) => {
    const response = await fetch(`http://localhost:5000/rides`)
    console.log(response)
    const newRides = await response.json()
    dispatch({
      type: NEED_RIDE,
      rides: newRides,
      id: id,
      inDashboard: false,
    })
  }
}
export const PATCH_SEAT = 'PATCH_SEAT'
export const BOOK_SEAT = 'BOOK_SEAT'
export function bookSeat(e) {
  e.preventDefault()
  let a = store.getState().concertReducer.concerts
  let concert = a.filter(ele=> {
    if(ele.Id == e.target.id) {
      return ele
    }
  })
  let ID = e.target.className.slice(3)
  console.log(ID)
  console.log(concert)
  let driverName = document.getElementsByClassName('driverName1')[0].innerHTML
  let departingTime = document.getElementsByClassName('departingTime1')[0].innerHTML
  let departingFrom = document.getElementsByClassName('departingFrom1')[0].innerHTML
  let phoneNumber = document.getElementsByClassName('phoneNumber1')[0].innerHTML
  let email = document.getElementsByClassName('email1')[0].innerHTML
  let seatsAvailable = document.getElementsByClassName('seatsAvailable1')[0].innerHTML
  let jwt = localStorage.getItem('token')
  let noOfSeats = Number(seatsAvailable) - 1
  return async (dispatch) => {
    const response = await fetch('http://localhost:5000/confirmedrides', {
      method: 'POST',
      body: JSON.stringify({
      concert_id: concert[0].Id,
      date_time: concert[0].Date,
      venue_name: concert[0].Venue.Name,
      artists: concert[0].Artists[0].Name,
      driverName:driverName,
      email:email,
      phone:phoneNumber,
      departingTime:departingTime,
      jwt: jwt,
    }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    if(response.status === 200) {
      var inDashboard = true
      window.Materialize.toast('successfully Added to your Need Ride', 2000)
    }
    const requestedRide = await response.json()
    console.log(offerRide)
  const responsePatch = await fetch(`http://localhost:5000/rides/${ID}`, {
    method: 'PATCH',
    body: JSON.stringify({"seatsAvailable": noOfSeats}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
  let a = await responsePatch.json()
  // console.log(responsePatch)
  console.log('json response: ',a)
    dispatch({
      type: BOOK_SEAT,
      inDashboard: 'inDashboard',
    })
  }
}
export const MY_CONFIRMED_RIDES = 'MY_CONFIRMED_RIDES'
export function myConfirmedRides(){
  return async (dispatch) => {
    const response = await fetch('http://localhost:5000/confirmedrides')
    // console.log(response)
    const confirmedrides = await response.json()
    dispatch({
      type: MY_CONFIRMED_RIDES,
      confirmedrides: confirmedrides,
      isConfirmedRides: true
    })
  }
}
export const MY_OFFERED_RIDES = 'MY_OFFERED_RIDES'
export function myOfferedRide(){
  return async (dispatch) => {
    const response = await fetch('http://localhost:5000/rides')
    // console.log(response)
    const offeredRides = await response.json()
    dispatch({
      type: MY_OFFERED_RIDES,
      offeredRides: offeredRides,
      myofferRide: true
    })
  }
}
export const TAKE_TO_DASHBOARD = 'TAKE_TO_DASHBOARD'
export function takeToDashboard() {
  return async (dispatch) => {
    dispatch({
      type: TAKE_TO_DASHBOARD,
    })
  }
}
export const LOG_OUT = 'LOG_OUT'
export function logout() {
  return async (dispatch) => {
    localStorage.setItem('token', '')
    dispatch({
      type: LOG_OUT,
    })
  }
}
export const DELETE_OFFER_RIDE = 'DELETE_OFFER_RIDE'
export function deleteOfferRide(e) {
  e.preventDefault()
  var id = e.target.id
  return async (dispatch) => {
    const response = await fetch(`http://localhost:5000/rides/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    dispatch({
      type: DELETE_OFFER_RIDE,
      deleteRide: true,
    })
  }
}
export const OFFER_A_RIDE = 'OFFER_A_RIDE'
export function offeraRide() {
  return async (dispatch) => {
    dispatch({
      type: OFFER_A_RIDE,
    })
  }
}
export const DELETE_CONFIRMED_RIDES = 'DELETE_CONFIRMED_RIDES'
export function deleteConfirmedRides(e) {
  e.preventDefault()
  var id = e.target.id
  console.log(id)
  return async (dispatch) => {
    const response = await fetch(`http://localhost:5000/confirmedrides/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    console.log(response)
    dispatch({
      type: DELETE_CONFIRMED_RIDES,
    })
  }
}
