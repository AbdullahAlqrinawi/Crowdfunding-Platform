import React from 'react'
import { inPercent } from '../../utils/utils'

const ProgressBar = ({goal, raisedAmount}) => {
  const percentage = inPercent(goal, raisedAmount)
  return (
    <div className='w-full rounded-lg h-2 bg-white overflow-hidden'>
        <div style={{width: percentage + '%'}} className='bg-indigo-700 h-full min-w-[2px]' />
    </div>
  )
}

export default ProgressBar
