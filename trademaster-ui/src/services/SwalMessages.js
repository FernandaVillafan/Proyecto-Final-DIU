import Swal from "sweetalert2";

class SwalMessages {
  constructor() {
    this.confirmMessage = async () => {
      return await Swal.fire({
        title: '¿Estás seguro?',
        html: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-yes',
          cancelButton: 'btn btn-cancel'
        },
        buttonsStyling: false
      });
    };
  }
    
  // Confirmation message
  successMessage(message) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      toast: true,
      html: message,
      background: '#E8F8F8',
      showConfirmButton: false,
      timer: 4000,
      width: 'auto',
      padding: '0.75em',
      customClass: {
        container: 'swal-container',
        popup: 'swal-popup'
      },
      target: document.body
    });
  }
   
  // Error message
  errorMessage(message) {
    if (message === null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        toast: true,
        html: "No se pudieron obtener los datos",
        background: '#F8E8F8',
        showConfirmButton: false,
        timer: 4000,
        width: 'auto',
        padding: '0.75em',
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup'
        },
        target: document.body
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        toast: true,
        html: message,
        background: '#F8E8F8',
        showConfirmButton: false,
        timer: 4000,
        width: 'auto',
        padding: '0.75em',
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup'
        },
        target: document.body
      });
    }
  }
}

// Creamos una instancia con nombre
const swalMessages = new SwalMessages();

// Exportamos la instancia
export default swalMessages;