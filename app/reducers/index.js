// ACTIONS

const SET_CURRENT = 'SET_CURRENT'


// REDUCER

export default (state = {}, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case SET_CURRENT:
      newState.currSong = action.song
      newState.currArtist = action.artist
      break
    default:
      return state
  }
  return newState
}
