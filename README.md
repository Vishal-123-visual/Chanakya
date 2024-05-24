import {useLocation} from 'react-router-dom'
import './StudentMarksResult.css' // Assuming you have a CSS file for styling

const StudentMarksResult = () => {
const location = useLocation()
const data = location.state

//console.log(data)

const handlePrint = () => {
var actContents = document.body.innerHTML
document.body.innerHTML = actContents
window.print()
}

return (
<body>
<div className='main'>
<table width='800px' cellPadding='0' cellSpacing='0' className='bground'>
<tbody>
<tr>
<td>
<table width='800px' cellPadding='0' cellSpacing='0'>
<tbody>
<tr>
<td valign='top' width='30%'>
<table width='100%' cellPadding='0' cellSpacing='0'>
<tbody>
{/_ <tr>
<td width='30%' className='line'>
&nbsp;
</td>
<td>&nbsp;</td>
</tr>
<tr>
<td width='30%' className='line'>
Sr. No.
</td>
<td>{data.id}</td>
</tr> _/}
</tbody>
</table>
</td>
{/_ <td width='40%' align='center' valign='top'>
<img
                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                          width='100px'
                          alt='vmsmandal'
                          title='VMS Mandal'
                        />
</td> _/}
<td width='30%' valign='top'>
<table width='100%' cellPadding='0' cellSpacing='0'>
<tbody>
{/_ <tr>
<td width='40%' className='line'>
&nbsp;
</td>
<td>&nbsp;</td>
</tr>
<tr>
<td className='line'>
<p>Centre Code</p>
</td>
<td>1000</td>
</tr>
<tr>
<td className='line'>&nbsp;</td>
<td>&nbsp;</td>
</tr>
<tr>
<td>Year</td>
<td>Semester 1</td>
</tr> _/}
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr className='m-5'>
<td>
<table width='100%' cellPadding='0' cellSpacing='0'>
<tbody>
<tr>
<td>
<table width='100%' cellPadding='0' cellSpacing='0'>
<tbody>
<tr>
<td width='20%'>&nbsp;</td>
<td width='60%' align='center'>
<table className='logo'>
<tbody>
{/_ <tr>
<td className='logo'>
<img
                                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                          width='100px'
                                          alt='vmsmandal'
                                          title='VMS Mandal'
                                        />
</td>
</tr> _/}
{/_ <tr>
<td align='center'>
<img
                                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                          width='100px'
                                          alt='vmsmandal'
                                          title='VMS Mandal'
                                        />
</td>
</tr> _/}
</tbody>
</table>
</td>
{/_ <td width='20%' align='center' className='pic'>
<img
                                  src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                  width='100px'
                                  alt='vmsmandal'
                                  title='VMS Mandal'
                                />
</td> _/}
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td>
<table width='98%' cellPadding='0' cellSpacing='0' className='marks' border='1'>
<thead>
<tr>
<th>ENROLLMENT NO.</th>
<th>ROLL NO.</th>
<th>EXAM TYPE</th>
<th>REGULAR/PRIVATE</th>
<th>CERTIFICATE NO.</th>
</tr>
</thead>
<tbody>
<tr>
<td>10110</td>
<td>0101</td>
<td>0201</td>
<td>2443</td>
<td>5566</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td>
<table width='100%' cellPadding='0' cellSpacing='0' className='stu-details'>
<tbody>
<tr>
<td width='25%'>&nbsp; </td>
<td width='75%'>&nbsp;</td>
</tr>
<tr>
<td width='25%'>This is to certify That</td>
<td width='75%'>{data.studentName}</td>
</tr>
<tr>
<td>
<small>Mother's Name</small>
</td>
<td>{data.motherName}</td>
</tr>
<tr>
<td>
<small>Father's Name</small>
</td>
<td>{data.fatherName}</td>
</tr>
<tr>
<td>
<small>Date of Birth</small>
</td>
<td>{data.dateOfBirth}</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td>
<table className='marks' width='98%' cellPadding='0' cellSpacing='0' border='1'>
<thead>
<tr>
<th width='10%' rowSpan='2' align='center' className='line'>
<br />
SUB.
<br />
CODE
</th>
<th width='30%' rowSpan='2' align='center' className='line'>
<br />
SUBJECT
</th>
<th rowSpan='2' align='center' className='line'>
<br />
MAX MARKS
</th>
<th colSpan='4' align='center' className='line'>
MARKS OBTAINED
</th>
</tr>
<tr>
<th align='center' className='line'>
<br />
THEORY
</th>
<th align='center' className='line'>
<br />
IA/
<br />
PR.
</th>
<th align='center' className='line'>
&nbsp;
<br />
TOTAL
</th>
<th width='12%' align='center' className='line'>
<br />
POSITIONAL GRADE
</th>
</tr>
</thead>
<tbody>
<tr>
<td align='center'>Math-100</td>
<td align='center'>Math</td>
<td align='center'>100</td>
<td align='center'>40</td>
<td align='center'>40</td>
<td align='center'>80</td>
<td align='center'>A</td>
</tr>
<tr>
<td align='center' colSpan='2'>
<strong>Total Marks</strong>
</td>
<td align='center'>80</td>
<td align='center'>-</td>
<td align='center'>-</td>
<td align='center'>80</td>
<td align='center'>-</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td>
<table width='98%' cellPadding='0' cellSpacing='0' className='stu-details'>
<tbody>
<tr>
<td width='14%'>DIVISION:</td>
<td width='21%' className='division'>
First Division
</td>
<td width='35%'>&nbsp;</td>
<td width='30%' rowSpan='4' align='center' valign='bottom'>
<img
                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                          width='60%'
                          alt='secretary-sign'
                          title='Secretary Sign'
                        />
</td>
</tr>
<tr>
<td colSpan='2' className='line'>
&nbsp;
</td>
<td>&nbsp;</td>
</tr>
<tr>
<td colSpan='2' className='line'>
General Awareness & life skills grade:
</td>
<td>A</td>
</tr>
<tr>
<td className='line'>&nbsp;</td>
<td>
<span className='line'>&nbsp;</span>
</td>
<td rowSpan='2' align='center'>
<img
                          src='https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                          width='30%'
                          alt='qr'
                          title='Website QR'
                        />
</td>
</tr>
<tr>
<td className='line'>Dated:</td>
<td>10/06/2024</td>
<td align='center'>Controller of Examination</td>
</tr>
{/_ <input value='Print' type='button' onClick={handlePrint} /> _/}
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</body>
)
}

export default StudentMarksResult
