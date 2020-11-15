<?php

namespace App\Repository;

use App\Entity\WebAuthnPublicKey;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method WebAuthnPublicKey|null find($id, $lockMode = null, $lockVersion = null)
 * @method WebAuthnPublicKey|null findOneBy(array $criteria, array $orderBy = null)
 * @method WebAuthnPublicKey[]    findAll()
 * @method WebAuthnPublicKey[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WebAuthnPublicKeyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WebAuthnPublicKey::class);
    }

    // /**
    //  * @return WebAuthnPublicKey[] Returns an array of WebAuthnPublicKey objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('w.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    public function findOneById($value): ?WebAuthnPublicKey
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.Id = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findOneByPublicKeyId($value): ?WebAuthnPublicKey
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.PublicKeyId = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
