import { useParams } from 'react-router-dom'

function RestaurantDetail() {
  const { id } = useParams()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">รายละเอียดร้าน (ID: {id})</h1>
      {/* TODO: ดึงข้อมูลร้านจาก backend */}
    </div>
  )
}

export default RestaurantDetail
