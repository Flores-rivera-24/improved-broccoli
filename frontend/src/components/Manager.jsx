import React from "react";
import {
  Table,
  Button,
  Container,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

class EmpleadosManager extends React.Component {
  state = {
    empleados: [],
    modalEditar: false,
    modalAgregar: false,
    empleadoSeleccionado: {
      id: "",
      nombre: "",
      empresa: "",
      puesto: "",
      expertise: "",
      edad: "",
      email: "",
      telefono: "",
    },
  };

  componentDidMount() {
    this.cargarEmpleados();
  }

  cargarEmpleados = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => this.setState({ empleados: data }))
      .catch((err) => console.error("Error al cargar empleados:", err));
  };

  mostrarModalEditar = (empleado) => {
    this.setState({
      empleadoSeleccionado: { ...empleado },
      modalEditar: true,
    });
  };

  cerrarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  mostrarModalAgregar = () => {
    this.setState({
      empleadoSeleccionado: {
        id: "",
        nombre: "",
        empresa: "",
        puesto: "",
        expertise: "",
        edad: "",
        email: "",
        telefono: "",
      },
      modalAgregar: true,
    });
  };

  cerrarModalAgregar = () => {
    this.setState({ modalAgregar: false });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      empleadoSeleccionado: {
        ...prev.empleadoSeleccionado,
        [name]: value,
      },
    }));
  };

  agregarEmpleado = () => {
    const { empleadoSeleccionado } = this.state;

    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleadoSeleccionado),
    })
      .then((res) => res.json())
      .then((nuevoEmpleado) => {
        this.setState((prev) => ({
          empleados: [...prev.empleados, nuevoEmpleado],
          modalAgregar: false,
        }));
      })
      .catch((err) => console.error("Error al agregar:", err));
  };

  actualizarEmpleado = () => {
    const { empleadoSeleccionado } = this.state;

    fetch(`http://localhost:5000/api/employees/${empleadoSeleccionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleadoSeleccionado),
    })
      .then((res) => res.json())
      .then(() => {
        this.setState((prev) => ({
          empleados: prev.empleados.map((emp) =>
            emp.id === empleadoSeleccionado.id ? empleadoSeleccionado : emp
          ),
          modalEditar: false,
        }));
      })
      .catch((err) => console.error("Error al actualizar:", err));
  };

  eliminarEmpleado = (empleado) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar a ${empleado.nombre}?`
    );

    if (confirmacion) {
      fetch(`http://localhost:5000/api/employees/${empleado.id}`, {
        method: "DELETE",
      })
        .then(() => {
          this.setState((prev) => ({
            empleados: prev.empleados.filter((e) => e.id !== empleado.id),
          }));
        })
        .catch((err) => console.error("Error al eliminar:", err));
    }
  };

  render() {
    const { empleados, empleadoSeleccionado, modalEditar, modalAgregar } = this.state;

    return (
      <Container className="mt-5">
        <h1 className="text-center mb-4">Gestión de Empleados</h1>

        <Button color="success" onClick={this.mostrarModalAgregar} className="mb-4">
          Agregar Empleado
        </Button>

        <Table striped bordered responsive>
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Puesto</th>
              <th>Expertise</th>
              <th>Edad</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.empresa}</td>
                <td>{empleado.puesto}</td>
                <td>{empleado.expertise}</td>
                <td>{empleado.edad}</td>
                <td>{empleado.email}</td>
                <td>{empleado.telefono}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => this.mostrarModalEditar(empleado)}
                    className="me-2"
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    color="danger"
                    onClick={() => this.eliminarEmpleado(empleado)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal Agregar */}
        <Modal isOpen={modalAgregar} toggle={this.cerrarModalAgregar}>
          <ModalHeader toggle={this.cerrarModalAgregar}>
            Agregar Empleado
          </ModalHeader>
          <ModalBody>{this.renderFormulario()}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.agregarEmpleado}>
              Guardar
            </Button>
            <Button color="secondary" onClick={this.cerrarModalAgregar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal Editar */}
        <Modal isOpen={modalEditar} toggle={this.cerrarModalEditar}>
          <ModalHeader toggle={this.cerrarModalEditar}>
            Editar Empleado
          </ModalHeader>
          <ModalBody>{this.renderFormulario(true)}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.actualizarEmpleado}>
              Guardar Cambios
            </Button>
            <Button color="secondary" onClick={this.cerrarModalEditar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }

  renderFormulario(esEdicion = false) {
    const { empleadoSeleccionado } = this.state;
    return (
      <>
        {esEdicion && (
          <FormGroup>
            <label>ID:</label>
            <input className="form-control" readOnly value={empleadoSeleccionado.id} />
          </FormGroup>
        )}
        <FormGroup>
          <label>Nombre:</label>
          <input
            className="form-control"
            name="nombre"
            type="text"
            onChange={this.handleChange}
            value={empleadoSeleccionado.nombre}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Empresa:</label>
          <input
            className="form-control"
            name="empresa"
            type="text"
            onChange={this.handleChange}
            value={empleadoSeleccionado.empresa}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Puesto:</label>
          <input
            className="form-control"
            name="puesto"
            type="text"
            onChange={this.handleChange}
            value={empleadoSeleccionado.puesto}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Expertise:</label>
          <input
            className="form-control"
            name="expertise"
            type="text"
            onChange={this.handleChange}
            value={empleadoSeleccionado.expertise}
          />
        </FormGroup>
        <FormGroup>
          <label>Edad:</label>
          <input
            className="form-control"
            name="edad"
            type="number"
            onChange={this.handleChange}
            value={empleadoSeleccionado.edad}
          />
        </FormGroup>
        <FormGroup>
          <label>Email:</label>
          <input
            className="form-control"
            name="email"
            type="email"
            onChange={this.handleChange}
            value={empleadoSeleccionado.email}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Teléfono:</label>
          <input
            className="form-control"
            name="telefono"
            type="tel"
            onChange={this.handleChange}
            value={empleadoSeleccionado.telefono}
          />
        </FormGroup>
      </>
    );
  }
}

export default EmpleadosManager;
