import React from 'react'

const SetFilter = ({ newFilter, handleFilterChange, showAll, setShowAll }) => {
    return (
      <div>
        <div>
          filter shown with:
          <input value={newFilter} onChange={handleFilterChange} />
        </div>
      </div>
    )
  }
export default SetFilter