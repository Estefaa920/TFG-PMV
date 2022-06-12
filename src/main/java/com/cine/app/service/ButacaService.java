package com.cine.app.service;

import com.cine.app.domain.Butaca;
import com.cine.app.domain.Sala;
import com.cine.app.repository.ButacaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Butaca}.
 */
@Service
@Transactional
public class ButacaService {

    private final Logger log = LoggerFactory.getLogger(ButacaService.class);

    private final ButacaRepository butacaRepository;

    public ButacaService(ButacaRepository butacaRepository) {
        this.butacaRepository = butacaRepository;
    }

    /**
     * Save a butaca.
     *
     * @param butaca the entity to save.
     * @return the persisted entity.
     */
    public Butaca save(Butaca butaca) {
        log.debug("Request to save Butaca : {}", butaca);
        return butacaRepository.save(butaca);
    }

    public void reservarButacas(Set<Butaca> butacaSeleccionadas){
        if(butacaSeleccionadas.size()==0 || butacaSeleccionadas == null){
         log.debug("Error Array de butacas bacia"); 
         return;  
        }
        log.debug("LA BUTACA NO ESTA VACIA");
        for(Butaca butaca: butacaSeleccionadas){
            log.debug("SE ESTA GUARDANDO LA BUTACA", butaca);
            //butaca.setReservado(true);
            butacaRepository.save(butaca);
        }

    }

    /**
     * Partially update a butaca.
     *
     * @param butaca the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Butaca> partialUpdate(Butaca butaca) {
        log.debug("Request to partially update Butaca : {}", butaca);

        return butacaRepository
            .findById(butaca.getId())
            .map(existingButaca -> {
                if (butaca.getPosicion() != null) {
                    existingButaca.setPosicion(butaca.getPosicion());
                }
                if (butaca.getPremium() != null) {
                    existingButaca.setPremium(butaca.getPremium());
                }

                return existingButaca;
            })
            .map(butacaRepository::save);
    }

    /**
     * Get all the butacas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Butaca> findAll(Pageable pageable) {
        log.debug("Request to get all Butacas");
        return butacaRepository.findAll(pageable);
    }

    public List<Butaca> findAllSala(Long numeroSala) {
        log.debug("!!!!! Request to get all Butacas for sala" + numeroSala);
        return butacaRepository.findSalaButaca(numeroSala);
    }

    public List<Butaca> findAllSala2(Sala sala) {
        log.debug("!!!!! Request to get all Butacas for sala" + sala);
        if(sala==null){
            log.debug("!!!!! LA SALAAAAA ES NULAAAAAA!! ");    
            return null;
        }
        return butacaRepository.findSalaButaca(sala.getId());
    }

    /**
     * Get one butaca by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Butaca> findOne(Long id) {
        log.debug("Request to get Butaca : {}", id);
        return butacaRepository.findById(id);
    }

    /**
     * Delete the butaca by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Butaca : {}", id);
        butacaRepository.deleteById(id);
    }
}
