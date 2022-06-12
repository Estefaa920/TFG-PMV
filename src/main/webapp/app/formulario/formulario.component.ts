import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAforo } from 'app/entities/aforo/aforo.model';
import { ICompra } from 'app/entities/compra/compra.model';
import { IPedido } from 'app/entities/pedido/pedido.model';
import { IProyeccion } from 'app/entities/proyeccion/proyeccion.model';
import { ResumenComponent } from './resumen-compra-modal/resumen-modal.component';
import { GeneralService } from './service/formulario-general.service';
import { FormularioProyeccionComponent } from './formulario-proyeccion/formulario-proyeccion.component';

@Component({
  selector: 'jhi-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent {
  titulo = 'Venta de Entradas ';

  nombreComprador = '';
  dniComprador = '';
  // butacasSeleccionada:IButaca[] =[];
  aforoSeleccionado: IAforo[] = [];
  pedidoComida: IPedido[] = [];
  proyeccionSeleccionada?: IProyeccion;

  lista_errores: string[] = [];
  error = false;

  mostrarComida = false;
  botonComida = 'Bar';

  compraFinal: ICompra = {};
  reiniciar = false;

  constructor(
    public modalService: NgbModal,
    protected router: ActivatedRoute,
    protected servicioGeneral: GeneralService,
    protected router2: Router
  ) {
    this.titulo;
    this.nombreComprador = this.servicioGeneral.getNombre();
    this.dniComprador = this.servicioGeneral.getDni();
    this.aforoSeleccionado = this.servicioGeneral.getAforo();
    this.proyeccionSeleccionada = this.servicioGeneral.getProyeccion();
  }

  finalizarCompra(): void {
    if (!this.validacionesInput()) {
      const modalRef = this.modalService.open(ResumenComponent);
      this.reiniciar = true;
      modalRef.closed.subscribe(reason => {
        if (reason === 'true') {
          this.reiniciarComponente();
        }
      });
    }
  }

  reiniciarComponente(): void {
    if (this.reiniciar) {
      window.location.reload();
    }
  }

  actualizar(): void {
    this.servicioGeneral.setNombre(this.nombreComprador);
    this.servicioGeneral.setDni(this.dniComprador);
  }

  validacionesInput(): boolean {
    this.lista_errores = [];

    if (this.nombreComprador === '') {
      this.lista_errores.push('El nombre del comprador no puede estar vacio');
    }
    if (this.dniComprador === '') {
      this.lista_errores.push('El dni del comprador no puede estar vacio');
    }
    if (this.proyeccionSeleccionada === undefined) {
      this.lista_errores.push('No ha escogido una proyeccion');
    }

    return (this.error = this.lista_errores.length > 0);
  }

  comidaVisibilidad(): void {
    if (this.mostrarComida) {
      this.mostrarComida = false;
      this.botonComida = 'Bar';
    } else {
      this.mostrarComida = true;
      this.botonComida = 'Ocultar';
    }
  }

  recargar(uri: string): void {
    this.router2.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => this.router2.navigate([uri]));
  }
}
