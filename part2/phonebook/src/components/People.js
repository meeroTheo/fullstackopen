import React from 'react'

const People = ({ persons }) => {
    return (
      <div>
        {persons.map((person, i) => (
          <div key={i}>
            {persons[i].name} {persons[i].number}
          </div>
        ))}
      </div>
    )
  }

export default People