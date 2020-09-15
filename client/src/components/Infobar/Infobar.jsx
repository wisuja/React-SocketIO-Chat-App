import React from 'react'

import './Infobar.css'
import onlineIcon from '../../icons/onlineIcon.png'
import closeIcon from '../../icons/closeIcon.png'

function Infobar({ room }) {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img src={onlineIcon} alt="online-img" className="onlineIcon" />
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
        <a href="/"><img src={closeIcon} alt="close-img" /></a>
      </div>
    </div>
  )
}

export default Infobar
