// Library imports
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

const useRequest = ({ url, method, onSuccess }) => {
  const { addToast } = useToasts();

  const doRequest = async (body = {}) => {
    try {
      const response = await axios[method](url, body);

      if (onSuccess && response) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errors = err?.response?.data;

      if (errors && errors.length) {
        errors.forEach(error =>
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          }),
        );
      } else {
        addToast(errors.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  return { doRequest };
};

export default useRequest;
