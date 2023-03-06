const List = (props) => {
    return (
      <div>
        <dl style={{listStyle: 'none'}}>
        {props.searchResults.map(result => 
          <dt key={result.name}>{result.name} {result.number} {' '} 
          <button onClick={()=>{props.deleteName(result.id); window.confirm(`Delete ${result.name}?`)}}>delete</button>
          </dt>
        )}
        </dl>
      </div>
    )
  }

  export default List