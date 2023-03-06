const Filter = (props) => {
  return (
    <div>
      <form>
        <div>
          filter shown with 
          <input
            value={props.newSearch}
            onChange={props.handleSearchChange}
          />
        </div>
      </form>
    </div>
   )
 }

 export default Filter