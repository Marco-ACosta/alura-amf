import { LucidRow, ModelPaginatorContract } from "@adonisjs/lucid/types/model"
import { Pagination } from "../../types/pagination.js"

/**
 * Interface base das entidades
 * @template Entity Tipo da entidade referente
 * @template CreateEntity Tipo da entidade para a criação
 * @template UpdateEntity Tipo da entidade para a atualização
*/
export default interface IBase<Entity extends LucidRow, CreateEntity, UpdateEntity> {
    /**
     * Cria uma entidade
     * @param {CreateEntity} createProps Propriedades usadas para criar a nova entidade
     * @param {boolean} validate Se `true`, realiza a validação antes da criação
     * @returns {Promise<Entity>} Retorna a entidade criada
    */
    Create: (createProps : CreateEntity, validate: boolean) => Promise<Entity>

    /**
     * Atualiza uma entidade
     * @param {UpdateEntity} updateProps Propriedades usadas para atualizar a entidade
     * @param {boolean} validate Se `true`, realiza a validação antes da atualização
     * @returns {Promise<Entity>} Retorna a entidade atualizada
    */
    Update: (updateProps : UpdateEntity, validate: boolean) => Promise<Entity>

    /**
     * Valida as propriedades da entidade
     * @param {CreateEntity} createProps As propriedades usadas para validação
     */
    Validate: (createProps : CreateEntity) => Promise<void>

    Get: (id : number) => Promise<Entity | null>

    Delete: (id : number) => Promise<void>

    List(pagination : Pagination) : Promise<ModelPaginatorContract<Entity>>
}