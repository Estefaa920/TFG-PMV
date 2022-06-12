package com.cine.app.service;

import com.cine.app.domain.Pedido;
import com.cine.app.repository.PedidoRepository;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pedido}.
 */
@Service
@Transactional
public class PedidoService {

    private final Logger log = LoggerFactory.getLogger(PedidoService.class);

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    /**
     * Save a pedido.
     *
     * @param pedido the entity to save.
     * @return the persisted entity.
     */
    public Pedido save(Pedido pedido) {
        log.debug("Request to save Pedido : {}", pedido);
        return pedidoRepository.save(pedido);
    }

    public void guardarPedido(Set<Pedido> pedidos){
        log.debug("Guardar pedidos generados");
        if(pedidos.size()==0 || pedidos == null){
            log.debug("Error Array de pedido o null bacia"); 
            return;  
           }
   
           for(Pedido pedido: pedidos){
               pedidoRepository.save(pedido);             
           }
    }

    /**
     * Partially update a pedido.
     *
     * @param pedido the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Pedido> partialUpdate(Pedido pedido) {
        log.debug("Request to partially update Pedido : {}", pedido);

        return pedidoRepository
            .findById(pedido.getId())
            .map(existingPedido -> {
                if (pedido.getCantidad() != null) {
                    existingPedido.setCantidad(pedido.getCantidad());
                }

                return existingPedido;
            })
            .map(pedidoRepository::save);
    }

    /**
     * Get all the pedidos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pedido> findAll(Pageable pageable) {
        log.debug("Request to get all Pedidos");
        return pedidoRepository.findAll(pageable);
    }

    /**
     * Get one pedido by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Pedido> findOne(Long id) {
        log.debug("Request to get Pedido : {}", id);
        return pedidoRepository.findById(id);
    }

    /**
     * Delete the pedido by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Pedido : {}", id);
        pedidoRepository.deleteById(id);
    }
}
