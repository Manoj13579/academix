import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import upload_image from "../../assets/upload_image.png";
import Loader from "../../utils/Loader";
import axiosInstance from "../../utils/axiosInstance";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { UserType } from "../../types/UserType";



const AdminProfileEdit = () => {
  const storedUser = sessionStorage.getItem("user");
const user: UserType = storedUser ? JSON.parse(storedUser) : null;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    image: null as File | null,
    adminId: user?._id || "",
  });

  // max file size to be uploaded set to 1 mb.
  const MAX_FILE_SIZE = 1 * 1024 * 1024; 
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size should be less than 1 MB");
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = user?.image;

      // If there is a new image selected, upload it
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", formData.image);
        const photoUploadResponse = await axiosInstance.post(`/api/upload/admin-image-upload`, uploadFormData);
        photoUrl = photoUploadResponse.data.data;
      }

      const updatedFormData = {
        ...formData,
        image: photoUrl,
      };

      const response = await axiosInstance.post(`/api/auth/admin-profile-edit`, updatedFormData);
      if (response.data.success) {
        toast.success(response.data.message);
         // Update session storage with the new user data. needed to get updated data instantly
         const updatedUser = {
          ...user,
          email: updatedFormData.email, 
          image: photoUrl
      };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setFormData({
          email: "",
          password: "",
          image: null,
          adminId: ""
        });
        navigate("/educator");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        return;
      }
      toast.error("Error in updating profile! Please try later");
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section>
      {loading && <Loader />}
      {/* Form */}
      <div className="container max-w-md mx-auto p-5 bg-white rounded-lg space-y-4 shadow-lg">
        <div className="text-2xl font-bold">Edit Profile</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-gray-700">New Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
            />
          </div>

          <div className="form-group mb-4">
          <label className="block text-gray-700">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
            />
             {/* Toggle icon */}
             <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-slate-500 h-6 w-6" />
              ) : (
                <AiFillEye className="text-slate-500 h-6 w-6" />
              )}
            </span>
          </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-500">Image types allowed: jpeg, jpg, png</p>
            <p className="text-gray-500">Image size shouldn't exceed 1 MB</p>
            <label htmlFor="file-input" className="flex items-center cursor-pointer">
              <img
                src={
                  formData.image
                    ? URL.createObjectURL(formData.image) // Preview selected image
                    : user?.image || upload_image // Default or user's current image by url
                }
                alt="Profile preview"
                className="w-28 h-28 rounded-lg border border-gray-300 object-cover mt-4"
              />
              <input
                type="file"
                onChange={handleFileChange}
                id="file-input"
                hidden
              />
            </label>
          </div>

          <div className="button-container flex justify-end mt-4">
            <button
              type="submit"
              className="submit-button bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminProfileEdit;