<?php

/*
 * This file is part of the OpenMiamMiam project.
 *
 * (c) Isics <contact@isics.fr>
 *
 * This source file is subject to the AGPL v3 license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Isics\Bundle\OpenMiamMiamBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Isics\OpenMiamMiamBundle\Entity\SalesOrderRow
 *
 * @ORM\Table(name="sales_order_row")
 * @ORM\Entity
 */
class SalesOrderRow
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var SalesOrder
     *
     * @ORM\ManyToOne(targetEntity="SalesOrder", inversedBy="salesOrderRows")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="sales_order_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * })
     */
    private $salesOrder;

    /**
     * @var Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="product_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     * })
     */
    private $product;

    /**
     * @var string $name
     *
     * @ORM\Column(name="name", type="string", length=128, nullable=false)
     */
    private $name;

    /**
     * @var string $ref
     *
     * @ORM\Column(name="ref", type="string", length=16, nullable=false)
     */
    private $ref;

    /**
     * @var boolean $isBio
     *
     * @ORM\Column(name="is_bio", type="boolean", nullable=false)
     * @todo rename to "isOrganicFood"
     */
    private $isBio;

    /**
     * @var decimal
     *
     * @ORM\Column(name="unit_price", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $unitPrice;

    /**
     * @var decimal
     *
     * @ORM\Column(name="quantity", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $quantity;

    /**
     * @var integer $total
     *
     * @ORM\Column(name="total", type="integer", nullable=false)
     */
    private $total;



    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param \Isics\Bundle\OpenMiamMiamBundle\Entity\Product $product
     */
    public function setProduct($product)
    {
        $this->product = $product;
    }

    /**
     * @return \Isics\Bundle\OpenMiamMiamBundle\Entity\Product
     */
    public function getProduct()
    {
        return $this->product;
    }

    /**
     * @param \Isics\Bundle\OpenMiamMiamBundle\Entity\decimal $quantity
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
    }

    /**
     * @return \Isics\Bundle\OpenMiamMiamBundle\Entity\decimal
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * @param \Isics\Bundle\OpenMiamMiamBundle\Entity\SalesOrder $salesOrder
     */
    public function setSalesOrder($salesOrder)
    {
        $this->salesOrder = $salesOrder;
    }

    /**
     * @return \Isics\Bundle\OpenMiamMiamBundle\Entity\SalesOrder
     */
    public function getSalesOrder()
    {
        return $this->salesOrder;
    }

    /**
     * @param int $total
     */
    public function setTotal($total)
    {
        $this->total = $total;
    }

    /**
     * @return int
     */
    public function getTotal()
    {
        return $this->total;
    }

    /**
     * @param \Isics\Bundle\OpenMiamMiamBundle\Entity\decimal $unitPrice
     */
    public function setUnitPrice($unitPrice)
    {
        $this->unitPrice = $unitPrice;
    }

    /**
     * @return \Isics\Bundle\OpenMiamMiamBundle\Entity\decimal
     */
    public function getUnitPrice()
    {
        return $this->unitPrice;
    }

    /**
     * @param boolean $isBio
     */
    public function setIsBio($isBio)
    {
        $this->isBio = $isBio;
    }

    /**
     * @return boolean
     */
    public function getIsBio()
    {
        return $this->isBio;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $ref
     */
    public function setRef($ref)
    {
        $this->ref = $ref;
    }

    /**
     * @return string
     */
    public function getRef()
    {
        return $this->ref;
    }
}