<?php

namespace App\Repository;

use App\Entity\DecryptionKey;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DecryptionKey|null find($id, $lockMode = null, $lockVersion = null)
 * @method DecryptionKey|null findOneBy(array $criteria, array $orderBy = null)
 * @method DecryptionKey[]    findAll()
 * @method DecryptionKey[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DecryptionKeyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DecryptionKey::class);
    }

    // /**
    //  * @return DecryptionKey[] Returns an array of DecryptionKey objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DecryptionKey
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
