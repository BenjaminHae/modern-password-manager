<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;


/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    public function findOneByUsernameAndPassword($username, $password): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.username = :user')
            ->andWhere('u.password = :password')
            ->setParameter('user', $username)
            ->setParameter('password', $password)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findOneByUsernameUNAUTHENTICATED($username): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.username = :user')
            ->setParameter('user', $username)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
