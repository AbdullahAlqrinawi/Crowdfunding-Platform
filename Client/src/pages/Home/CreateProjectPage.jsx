import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import MetaMaskButton from '../../components/project/MetaMaskButton';
import StepOverview from '../../steps/StepOverview';
import StepFunding from '../../steps/StepFunding';
import StepRewards from '../../steps/StepRewards';
import StepStory from '../../steps/StepStory';
import StepDetails from '../../steps/StepDetails'; 
import StepPayment from '../../steps/StepPayment';
import Navbar from '../../components/project/Navbar';
import { Footer } from '../../components/landing';
import styles from "../../style";
import { useUser } from '../../components/project/UserContext';


const steps = [
  { title: 'Project Overview', description: 'Tell us what your project is about.' },
  { title: 'Funding', description: 'Set your funding goal and campaign duration.' },
  { title: 'Rewards', description: 'Offer something for your backers.' },
  { title: 'Story', description: 'Share your project story and vision.' },
  { title: 'Project Details', description: 'Choose project details like location, category, etc.' },
  { title: 'Payment', description: 'Connect your wallet for payments.' },
];


export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const token = localStorage.getItem('token');  


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    image: null,
    start_date: '',
    end_date: '',
    rewards: [{ title: '', description: '', amount: '' }],
    story: '',
    location: '',
    categoryMain: '',
    categoryOptional: '',
    type: '',
    wallet_address: '',
});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleRewardChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRewards = [...formData.rewards];
    updatedRewards[index][name] = value;
    setFormData({ ...formData, rewards: updatedRewards });
  };

  const addReward = () => {
    setFormData({ ...formData, rewards: [...formData.rewards, { title: '', description: '', amount: '' }] });
  };

  const removeReward = (index) => {
    const updatedRewards = [...formData.rewards];
    updatedRewards.splice(index, 1);
    setFormData({ ...formData, rewards: updatedRewards });
  };

const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setFormData({ ...formData, wallet_address: accounts[0] });
      setWalletConnected(true);
      toast.success('Wallet connected!');
    } catch (err) {
      toast.error('Failed to connect wallet.');
    } finally {
      setConnecting(false);
    }
  } else {
    toast.error('MetaMask not found. Please install it.');
  }
};



  const handlePrevious = () => {
  if (currentStep > 0) {
    setCurrentStep(prev => prev - 1);
  }
};
const handleNext = () => {
  const currentFields = {
    0: ['title', 'description'],
    1: ['target', 'start_date', 'end_date'],
    2: ['rewards'],
    3: ['story'],
    4: ['location', 'categoryMain', 'type'],
    5: ['wallet_address'], 
  };


  const fieldsToCheck = currentFields[currentStep];
  if (fieldsToCheck) {
    const missing = fieldsToCheck.filter(field => {
      if (field === 'rewards') {
        return formData.rewards.length === 0 || formData.rewards.some(reward => !reward.title || !reward.description || !reward.amount);
      }
      return !formData[field];
    });

    if (missing.length > 0) {
      toast.error('Please fill in all required fields before proceeding.');
      return;
    }
  }

  if (currentStep < steps.length - 1) {
    setCurrentStep(prev => prev + 1);
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    if (formData.image && !['image/png', 'image/jpeg', 'image/jpg'].includes(formData.image.type)) {
      toast.error('Please upload a valid image (JPG, JPEG, PNG).');
      return;
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'rewards') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
  method: 'POST',
  body: data,
  headers: {
    Authorization: `Bearer ${token}`,
  }
});

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Failed to create project');
      }
    } catch (error) {
      toast.error('Something went wrong while submitting your project.');
    }
  };



 const renderStep = () => {
  switch (currentStep) {
    case 0: return <StepOverview formData={formData} handleChange={handleChange} />;
    case 1: return <StepFunding formData={formData} handleChange={handleChange} />;
    case 2: return <StepRewards formData={formData} handleRewardChange={handleRewardChange} addReward={addReward} removeReward={removeReward} />;
case 3: return <StepStory formData={formData} handleChange={handleChange} setFormData={setFormData} />;
    case 4: return <StepDetails formData={formData} handleChange={handleChange} />;
    case 5: return <StepPayment
      connectWallet={connectWallet}
      walletConnected={walletConnected}
      wallet_address={formData.wallet_address}
      connecting={connecting}
    />;
    default: 
      return <div className="text-center text-red-500">Unknown Step. Please refresh the page.</div>;
  }
};


  return (
    
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full min-h-screen bg-primary text-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${index === currentStep ? 'bg-white text-black' : 'bg-gray-600 text-white'}`}
                >
                  {index + 1}
                </div>
                <p className={`text-xs mt-2 ${index === currentStep ? 'text-white' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute top-4 right-0 w-full h-0.5 bg-gray-600 z-0 translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 py-8">
          <div className="space-y-6 pr-4 border-r border-gray-700 hidden md:block">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-gray-400">{steps[currentStep].description}</p>
          </div>

          <div className="space-y-6">{renderStep()}</div>

         <div className={`md:col-span-2 flex mt-8 ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}>
  {currentStep > 0 && (
    <button
      type="button"
      onClick={handlePrevious}
      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
    >
      Previous
    </button>
  )}

  {currentStep < steps.length - 1 ? (
    <button
      type="button"
      onClick={handleNext}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition"
    >
      Next
    </button>
  ) : (
    <button
      type="submit"
      className={`px-6 py-2 rounded-lg text-white transition ${walletConnected ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-500 cursor-not-allowed'}`}
      disabled={!walletConnected}
    >
      {walletConnected ? 'Submit Project' : 'Connect Wallet to Submit'}
    </button>
  )}
</div>


        </form>
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer /></div></div>
    </>
  );
}
