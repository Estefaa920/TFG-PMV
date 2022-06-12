import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPedido, Pedido } from 'app/entities/pedido/pedido.model';
import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';
import { GeneralService } from '../service/formulario-general.service';

@Component({
  selector: 'jhi-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['../formulario.component.scss'],
})
export class FormularioProductoComponent implements OnInit {
  comida: IPedido[] = [];
  productos?: IProducto[];

  titulo = 'Formulario Cine Producto';

  opcionSeleccionado = '';
  cantidad = 1;
  isLoading = false;

  constructor(public servicioGeneral: GeneralService, protected productoService: ProductoService) {
    this.titulo;
  }

  ngOnInit(): void {
    this.titulo;
    this.loadAll();
    this.comida = this.servicioGeneral.getPedidos();
  }

  loadAll(): void {
    this.isLoading = true;

    this.productoService.query().subscribe({
      next: (res: HttpResponse<IProducto[]>) => {
        this.isLoading = false;
        this.productos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onClick(sumar: boolean): void {
    let prd;
    const index = this.checkInlist(this.opcionSeleccionado);
    const producto = this.productos!.find(obj => {
      prd = obj.nombre === this.opcionSeleccionado;
      return prd;
    });

    const pedido: Pedido = {
      producto: producto!,
      cantidad: this.cantidad++,
    };

    if (index >= 0) {
      if (sumar) {
        this.cantidad = this.comida[index].cantidad!++;
      } else {
        this.comida[index].cantidad = this.comida[index].cantidad! > 0 ? this.comida[index].cantidad! - 1 : 0;
      }
    } else {
      if (this.opcionSeleccionado !== '') {
        this.comida.push(pedido);
      }
    }
    this.cantidad = 1;

    this.servicioGeneral.setPedidos(this.comida);
  }

  trackId(index: number, item: IProducto): number {
    return item.id!;
  }

  borrar(indice: number): void {
    this.comida.splice(indice, 1);
    this.servicioGeneral.setPedidos(this.comida);
    this.cantidad = 1;
  }

  checkInlist(nombre: string): number {
    for (let index = 0; index < this.comida.length; index++) {
      const element = this.comida[index];

      if (element.producto?.nombre === nombre) {
        return index;
      }
    }
    return -1;
  }
}
