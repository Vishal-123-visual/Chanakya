const EmailTemplate = () => {
  return (
    <div className='card p-10'>
      <h1>Email Remainder Text</h1>
      <form>
        <div className='mb-3'>
          <label htmlFor='firstremainder' className='form-label'>
            First Remainder
          </label>
          <input
            type='text'
            className='form-control'
            id='firstremainder'
            aria-describedby='emailHelp'
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='secondremainder' className='form-label'>
            Second Remainder
          </label>
          <input
            type='text'
            className='form-control'
            id='secondremainder'
            aria-describedby='emailHelp'
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='thirdremainder' className='form-label'>
            Third Remainder
          </label>
          <input
            type='text'
            className='form-control'
            id='thirdremainder'
            aria-describedby='emailHelp'
          />
        </div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  )
}
export default EmailTemplate
