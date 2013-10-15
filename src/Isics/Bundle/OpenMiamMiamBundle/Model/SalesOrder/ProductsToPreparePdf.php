<?php

/*
 * This file is part of the OpenMiamMiam project.
 *
 * (c) Isics <contact@isics.fr>
 *
 * This source file is subject to the AGPL v3 license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Isics\Bundle\OpenMiamMiamBundle\Model\SalesOrder;

use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

class ProductsToPreparePdf
{
    /**
     * @var \TCPDF $pdf
     */
    protected $pdf;

    /**
     * @var EngineInterface
     */
    protected $engine;

    /**
     * @var string $view
     */
    protected $view;

    /**
     * @var ProducerBranchOccurrenceSalesOrders
     */
    protected $producerSalesOrders;

    /**
     * @var array
     */
    protected $productConfig;

    /**
     * @var array $products
     */
    protected $products;



    /**
     * Constructs object
     *
     * @param array $productConfig
     * @param string $view
     * @param \TCPDF $pdf
     * @param EngineInterface $engine
     */
    public function __construct(array $productConfig, $view, \TCPDF $pdf, EngineInterface $engine)
    {
        $this->pdf = $pdf;
        $this->engine = $engine;
        $this->view = $view;
        $this->productConfig = $productConfig;
    }

    /**
     * Sets sales orders
     *
     * @param ProducerBranchOccurrenceSalesOrders $producerSalesOrders
     */
    public function setProducerSalesOrders(ProducerBranchOccurrenceSalesOrders $producerSalesOrders)
    {
        $this->producerSalesOrders = $producerSalesOrders;
    }

    /**
     * Builds pdf
     */
    public function build()
    {
        $this->initProducts();

        $this->pdf->AddPage();
        $this->pdf->writeHTML($this->engine->render($this->view, array(
            'producer' => $this->producerSalesOrders->getProducer(),
            'products' => $this->products,
            'branchOccurrence' => $this->producerSalesOrders->getBranchOccurrence()
        )));
    }

    /**
     * Initialize products from producer sales orders
     *
     * @return array
     */
    public function initProducts()
    {
        $this->products = array();
        $miscProducts = array();

        foreach ($this->producerSalesOrders->getSalesOrders() as $producerSalesOrder) {
            foreach ($producerSalesOrder->getSalesOrderRows() as $row) {
                if ($row->getRef() == $this->productConfig['artificial_product_ref']) {
                    $miscProducts[] = array('nb' => $row->getQuantity(), 'row' => $row);
                    continue;
                }

                if (!isset($this->products[$row->getRef()])) {
                    $this->products[$row->getRef()] = array('nb' => $row->getQuantity(), 'row' => $row);
                } else {
                    $this->products[$row->getRef()]['nb'] += $row->getQuantity();
                }
            }
        }

        ksort($this->products);

        $this->products = array_merge($this->products, $miscProducts);
    }

    /**
     * Returns html
     *
     * @param $filename
     *
     * @return string
     */
    public function render($filename = null)
    {
        $this->build();

        return $this->pdf->Output($filename, 'I');
    }
}
