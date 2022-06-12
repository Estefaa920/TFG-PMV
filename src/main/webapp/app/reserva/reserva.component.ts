import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IButaca } from '../entities/butaca/butaca.model';
import { GeneralService } from 'app/formulario/service/formulario-general.service';
import { IProyeccion } from '../entities/proyeccion/proyeccion.model';
import { AforoService } from '../entities/aforo/service/aforo.service';
import { IAforo, Aforo } from '../entities/aforo/aforo.model';
import { AccountService } from '../core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResumenComponent } from 'app/formulario/resumen-compra-modal/resumen-modal.component';
import { ProyeccionService } from '../entities/proyeccion/service/proyeccion.service';

@Component({
  selector: 'jhi-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
})
export class ReservaComponent implements OnInit {
  maxLine = 0;
  posPasillo = 4;
  @Input() numeroProyeccion?: number;
  boton = false;
  @Input() proyeccion?: IProyeccion;
  butacasAforo?: IAforo[];
  butacasAforoSeleccionada: IAforo[] = [];
  posicionAforo: IAforo[][] = [[], [], [], [], []];
  @Input() abiertoDesdeModal = false;
  @Output() aforosSeleccionado = new EventEmitter<IAforo[]>();
  proyeccionCliente?: IProyeccion | null;

  account: Account | null = null;

  constructor(
    protected aforoService: AforoService,
    protected router: ActivatedRoute,
    protected navegar: Router,
    protected servicioGeneral: GeneralService,
    protected accountService: AccountService,
    protected modalService: NgbModal,
    protected proyeccionService: ProyeccionService
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    this.router.data.subscribe({
      next: ({ proyeccion }) => {
        if (proyeccion !== undefined) {
          this.proyeccion = proyeccion;
          this.numeroProyeccion = this.proyeccion!.id!;
        }

        this.buscar();
      },
      error: () => {
        this.buscar();
      },
    });
  }

  maxFila(): void {
    let max = 0;
    for (let i = 0; i < this.posicionAforo.length; i++) {
      if (this.posicionAforo[i].length > max) {
        max = this.posicionAforo[i].length;
      }
    }
    this.maxLine = max;
  }
  buscar(): void {
    this.aforoService
      .query2({
        numeroProyeccion: this.numeroProyeccion,
      })
      .subscribe({
        next: (res: HttpResponse<Aforo[]>) => {
          this.butacasAforo = res.body ?? [];

          this.inicializarButacas();
          this.nuevoOrden();
          this.ordenar();
        },
      });

    if (this.account?.authorities?.toString() === 'ROLE_CLIENTE') {
      if (this.numeroProyeccion !== undefined) {
        this.proyeccionService.find(this.numeroProyeccion).subscribe(proyeccion => {
          this.proyeccionCliente = proyeccion.body;
        });
      }
    }
  }

  ordenarAforoPosicion(array: Aforo[]): void {
    array.sort((a, b) => {
      if (a.butaca!.posicionfront! < b.butaca!.posicionfront!) {
        return -1;
      }
      if (a.butaca!.posicionfront! > b.butaca!.posicionfront!) {
        return 1;
      }
      return 0;
    });
  }

  reservar(aforo: Aforo): void {
    let index = 0;
    if (!aforo.butaca!.reservadoFront) {
      if (!aforo.butaca!.seleccionadoFront) {
        aforo.butaca!.seleccionadoFront = true;
        this.butacasAforoSeleccionada.push(aforo);
        aforo.butaca!.seleccionadoFront = true;
      } else {
        aforo.butaca!.seleccionadoFront = false;
        index = this.butacasAforoSeleccionada.indexOf(aforo);
        this.butacasAforoSeleccionada.splice(index, 1);
      }
    }
    this.boton = this.butacasAforoSeleccionada.length !== 0;

    this.aforosSeleccionado.emit(this.butacasAforoSeleccionada);
  }

  nuevoOrden(): void {
    for (let i = 0; i < this.butacasAforo!.length; i++) {
      this.posicionAforo[this.butacasAforo![i].butaca!.posicion!.charCodeAt(0) - 65].push(this.butacasAforo![i]);
    }
    this.maxFila();
  }

  ordenar(): void {
    for (let i = 0; i <= this.posicionAforo.length; i++) {
      this.ordenarAforoPosicion(this.posicionAforo[i]);
    }
  }

  nunToChart(argumento: number): string {
    const abedecedario = 'ABCDEFGHIJKLMNÑOPQRSTUWXYZ';
    return abedecedario.charAt(argumento);
  }

  inicializarButacas(): void {
    for (const aforo of this.butacasAforo!) {
      aforo.butaca!.seleccionadoFront = false;
      aforo.butaca!.reservadoFront = aforo.reservada;
      const posicion: string | undefined = aforo.butaca!.posicion;
      const indexPosicion: number | undefined = posicion?.length;
      aforo.butaca!.posicionfront = Number(posicion?.substring(1, indexPosicion));
    }
  }

  finalizarCompra(): void {
    const modalRef = this.modalService.open(ResumenComponent);
  }

  guardarReserva(): void {
    for (const aforo of this.butacasAforoSeleccionada) {
      aforo.reservada = true;
    }
    if (this.account?.authorities?.toString() === 'ROLE_CLIENTE') {
      this.servicioGeneral.setDni('y787867');

      this.servicioGeneral.setAforo(this.butacasAforoSeleccionada);
      this.servicioGeneral.setNombre(this.account!.login);
      this.servicioGeneral.setProyeccion(this.proyeccionCliente!);

      this.finalizarCompra();

      return;
    }

    this.servicioGeneral.setAforo(this.butacasAforoSeleccionada);
    this.navegar.navigate(['formulario']);
  }
}
